/**
 * EventHive-C TypeScript SDK
 * ============================================================
 * Kirov Dynamics Technology — Type-safe client for the
 * EventHive-C C backend over HTTP.
 *
 * Provides:
 *  - Full type definitions for all API entities
 *  - Strongly-typed async client with fetch
 *  - SLA timer logic mirrored from the C engine
 *  - React hook: useEventHive()
 *
 * Usage:
 *   const client = new EventHiveClient({ tenantId: 'gala-2026' });
 *   const task   = await client.dispatchTask({ title: 'VIP Issue', priority: 'P1' });
 */

// ─── Enums & Constants ──────────────────────────────────────────────────────

export type Priority = 'P1' | 'P2' | 'P3';
export type TaskStatus = 'open' | 'escalated' | 'resolved' | 'closed';
export type Severity  = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

/** SLA thresholds in milliseconds — mirrors C engine uv_timer_t values */
export const SLA_THRESHOLDS_MS: Record<Priority, number> = {
  P1: 5_000,   // 5 seconds  → Urgent, immediate escalation
  P2: 15_000,  // 15 seconds → High, management notified
  P3: 60_000,  // 60 seconds → Standard monitoring
} as const;

// ─── API Entity Types ────────────────────────────────────────────────────────

export interface EventTask {
  id:          number;
  title:       string;
  priority:    Priority;
  status:      TaskStatus;
  escalation:  number;       // 0 = monitoring, 1 = SLA breached
  tenant_id:   string;
  created_at:  string;       // ISO 8601
  resolved_at?: string;
}

export interface EngineStats {
  tenant_id:    string;
  open_tickets: number;
  sla_breaches: number;
  engine:       string;      // e.g. "C11"
  event_loop:   string;      // e.g. "libuv"
  uptime_ms:    number;
}

export interface CreateTaskPayload {
  title:    string;
  priority: Priority;
}

export interface TaskListResponse {
  tasks:  EventTask[];
  total:  number;
  tenant: string;
}

export interface ApiError {
  code:    number;
  message: string;
  detail?: string;
}

// ─── Client Configuration ────────────────────────────────────────────────────

export interface EventHiveClientConfig {
  /** Tenant ID passed as X-Tenant-ID header on every request */
  tenantId: string;
  /**
   * Base URL of the EventHive-C engine.
   * Defaults to http://localhost:7000
   */
  baseUrl?: string;
  /** Request timeout in milliseconds. Default: 5000 */
  timeoutMs?: number;
}

// ─── HTTP Client ─────────────────────────────────────────────────────────────

export class EventHiveClient {
  private readonly baseUrl:   string;
  private readonly tenantId:  string;
  private readonly timeoutMs: number;

  constructor(config: EventHiveClientConfig) {
    this.tenantId  = config.tenantId;
    this.baseUrl   = (config.baseUrl ?? 'http://localhost:7000').replace(/\/$/, '');
    this.timeoutMs = config.timeoutMs ?? 5_000;
  }

  private get headers(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-Tenant-ID':  this.tenantId,
    };
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: this.headers,
        body:    body ? JSON.stringify(body) : undefined,
        signal:  controller.signal,
      });

      if (!response.ok) {
        const err: ApiError = await response.json().catch(() => ({
          code:    response.status,
          message: response.statusText,
        }));
        throw new EventHiveError(err.code, err.message, err.detail);
      }

      return response.json() as Promise<T>;
    } finally {
      clearTimeout(timer);
    }
  }

  /** Fetch live statistics for the current tenant */
  async getStats(): Promise<EngineStats> {
    return this.request<EngineStats>('GET', '/stats');
  }

  /** Fetch all active tasks for the current tenant */
  async listTasks(): Promise<EventTask[]> {
    return this.request<EventTask[]>('GET', '/tickets');
  }

  /** Dispatch a new event task */
  async dispatchTask(payload: CreateTaskPayload): Promise<EventTask> {
    if (!payload.title.trim()) {
      throw new EventHiveError(400, 'Task title cannot be empty');
    }
    return this.request<EventTask>('POST', '/tickets', payload);
  }

  /** Resolve an existing task by ID */
  async resolveTask(taskId: number): Promise<EventTask> {
    return this.request<EventTask>('PATCH', `/tickets/${taskId}`, { status: 'resolved' });
  }
}

// ─── Custom Error ─────────────────────────────────────────────────────────────

export class EventHiveError extends Error {
  constructor(
    public readonly code:    number,
    message:                 string,
    public readonly detail?: string,
  ) {
    super(message);
    this.name = 'EventHiveError';
  }
}

// ─── SLA Utilities ───────────────────────────────────────────────────────────

/**
 * Returns how many milliseconds remain before an SLA breach.
 * Returns 0 if already breached.
 */
export function slaRemainingMs(task: EventTask): number {
  const threshold = SLA_THRESHOLDS_MS[task.priority];
  const elapsed   = Date.now() - new Date(task.created_at).getTime();
  return Math.max(0, threshold - elapsed);
}

/** True if the task has breached its SLA deadline */
export function isSlaBreached(task: EventTask): boolean {
  return task.escalation > 0 || slaRemainingMs(task) === 0;
}

/**
 * Returns a human-readable countdown string, e.g. "12s remaining"
 * or "SLA BREACHED"
 */
export function slaCountdownLabel(task: EventTask): string {
  if (isSlaBreached(task)) return '⚠️ SLA BREACHED';
  const remaining = slaRemainingMs(task);
  const seconds   = Math.ceil(remaining / 1000);
  return `${seconds}s remaining`;
}

/** Sort tasks: escalated first, then by priority, then newest first */
export function sortTasks(tasks: EventTask[]): EventTask[] {
  const priorityOrder: Record<Priority, number> = { P1: 0, P2: 1, P3: 2 };
  return [...tasks].sort((a, b) => {
    if (isSlaBreached(b) !== isSlaBreached(a)) return isSlaBreached(b) ? 1 : -1;
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.id - a.id;
  });
}

// ─── React Hook (optional, tree-shakeable) ───────────────────────────────────

/**
 * useEventHive — Real-time polling hook for React apps.
 *
 * @example
 * const { tasks, stats, dispatch, loading, error } = useEventHive({
 *   tenantId: 'gala-2026',
 *   pollIntervalMs: 1000,
 * });
 */
export interface UseEventHiveOptions extends EventHiveClientConfig {
  pollIntervalMs?: number;
}

export interface UseEventHiveReturn {
  tasks:    EventTask[];
  stats:    EngineStats | null;
  loading:  boolean;
  error:    string | null;
  dispatch: (payload: CreateTaskPayload) => Promise<void>;
  resolve:  (taskId: number) => Promise<void>;
}

// NOTE: Import React in your project. This file stays framework-agnostic
// by using a lazy dynamic import pattern so it works in Node too.
export function useEventHive(options: UseEventHiveOptions): UseEventHiveReturn {
  // Lazy React import — only resolves when called inside a React component.
  // Swap this for your preferred state management if needed.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useState, useEffect, useCallback, useRef } = require('react');
    const client = new EventHiveClient(options);
    const interval = options.pollIntervalMs ?? 1_000;

    const [tasks,   setTasks]   = useState<EventTask[]>([]);
    const [stats,   setStats]   = useState<EngineStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);
    const mountedRef = useRef(true);

    const poll = useCallback(async () => {
      try {
        const [t, s] = await Promise.all([client.listTasks(), client.getStats()]);
        if (mountedRef.current) {
          setTasks(sortTasks(t));
          setStats(s);
          setError(null);
        }
      } catch (e) {
        if (mountedRef.current) setError((e as Error).message);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }, []);

    useEffect(() => {
      mountedRef.current = true;
      poll();
      const id = setInterval(poll, interval);
      return () => { mountedRef.current = false; clearInterval(id); };
    }, [poll, interval]);

    const dispatch = useCallback(async (payload: CreateTaskPayload) => {
      await client.dispatchTask(payload);
      await poll();
    }, [poll]);

    const resolve = useCallback(async (taskId: number) => {
      await client.resolveTask(taskId);
      await poll();
    }, [poll]);

    return { tasks, stats, loading, error, dispatch, resolve };
  } catch {
    // React not installed — return a no-op stub for Node/CLI usage
    return {
      tasks: [], stats: null, loading: false, error: 'React not available',
      dispatch: async () => {}, resolve: async () => {},
    };
  }
}
