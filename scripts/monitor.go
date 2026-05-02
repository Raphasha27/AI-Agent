// EventHive Health Monitor — Go
// ============================================================
// Kirov Dynamics Technology
//
// Lightweight, dependency-free health checker for the
// EventHive-C engine. Polls the /stats endpoint and prints
// a structured report to stdout.
//
// Build:  go build -o eventhive-monitor ./monitor.go
// Run:    ./eventhive-monitor --host localhost --port 7000 --tenant gala-2026
// Watch:  ./eventhive-monitor --watch --interval 5

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// ─── ANSI colours ─────────────────────────────────────────────────────────────

const (
	colRed    = "\033[91m"
	colYellow = "\033[93m"
	colGreen  = "\033[92m"
	colCyan   = "\033[96m"
	colBold   = "\033[1m"
	colReset  = "\033[0m"
)

func red(s string) string    { return colRed + s + colReset }
func green(s string) string  { return colGreen + s + colReset }
func yellow(s string) string { return colYellow + s + colReset }
func bold(s string) string   { return colBold + s + colReset }

// ─── Data Types ───────────────────────────────────────────────────────────────

type EngineStats struct {
	TenantID    string `json:"tenant_id"`
	OpenTickets int    `json:"open_tickets"`
	SLABreaches int    `json:"sla_breaches"`
	Engine      string `json:"engine"`
	EventLoop   string `json:"event_loop"`
	UptimeMs    int64  `json:"uptime_ms"`
}

type HealthResult struct {
	Timestamp string
	Host      string
	Port      int
	TenantID  string
	Reachable bool
	LatencyMs int64
	Stats     *EngineStats
	Error     string
}

// ─── Health Check ─────────────────────────────────────────────────────────────

func checkHealth(host string, port int, tenantID string, timeoutMs int) HealthResult {
	result := HealthResult{
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Host:      host,
		Port:      port,
		TenantID:  tenantID,
	}

	url := fmt.Sprintf("http://%s:%d/stats", host, port)
	client := &http.Client{Timeout: time.Duration(timeoutMs) * time.Millisecond}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		result.Error = fmt.Sprintf("failed to build request: %v", err)
		return result
	}
	req.Header.Set("X-Tenant-ID", tenantID)
	req.Header.Set("User-Agent", "EventHive-Monitor/1.0 (Kirov Dynamics)")

	start := time.Now()
	resp, err := client.Do(req)
	result.LatencyMs = time.Since(start).Milliseconds()

	if err != nil {
		result.Error = fmt.Sprintf("connection failed: %v", err)
		return result
	}
	defer resp.Body.Close()

	result.Reachable = true

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		result.Error = fmt.Sprintf("failed to read body: %v", err)
		return result
	}

	var stats EngineStats
	if err := json.Unmarshal(body, &stats); err != nil {
		result.Error = fmt.Sprintf("failed to parse JSON: %v", err)
		return result
	}
	result.Stats = &stats
	return result
}

// ─── Reporters ────────────────────────────────────────────────────────────────

func printTerminal(r HealthResult) {
	divider := "═══════════════════════════════════════════════════════════"
	fmt.Println(bold(divider))
	fmt.Printf("  %s\n", bold("EventHive-C Health Monitor — Kirov Dynamics Technology"))
	fmt.Println(bold(divider))
	fmt.Printf("  Time     : %s\n", r.Timestamp)
	fmt.Printf("  Target   : http://%s:%d\n", r.Host, r.Port)
	fmt.Printf("  Tenant   : %s\n", r.TenantID)
	fmt.Printf("  Latency  : %dms\n", r.LatencyMs)
	fmt.Println()

	if !r.Reachable {
		fmt.Printf("  Status   : %s\n", red("❌  UNREACHABLE"))
		fmt.Printf("  Error    : %s\n", r.Error)
	} else if r.Stats != nil {
		s := r.Stats
		status := green("✅  HEALTHY")
		if s.SLABreaches > 0 {
			status = yellow("⚠️  DEGRADED — SLA BREACHES DETECTED")
		}
		fmt.Printf("  Status   : %s\n", status)
		fmt.Printf("  Engine   : %s  |  Event Loop: %s\n", s.Engine, s.EventLoop)
		fmt.Printf("  Tasks    : %d open  |  SLA Breaches: %s\n",
			s.OpenTickets,
			formatBreaches(s.SLABreaches),
		)
		uptime := time.Duration(s.UptimeMs) * time.Millisecond
		fmt.Printf("  Uptime   : %s\n", formatDuration(uptime))
	} else if r.Error != "" {
		fmt.Printf("  Status   : %s\n", red("❌  ERROR"))
		fmt.Printf("  Error    : %s\n", r.Error)
	}

	fmt.Println(bold(divider))
}

func printJSON(r HealthResult) {
	data, _ := json.MarshalIndent(r, "", "  ")
	fmt.Println(string(data))
}

func formatBreaches(n int) string {
	if n == 0 {
		return green("0")
	}
	return red(fmt.Sprintf("%d ⚠️", n))
}

func formatDuration(d time.Duration) string {
	if d < time.Minute {
		return fmt.Sprintf("%.1fs", d.Seconds())
	}
	if d < time.Hour {
		return fmt.Sprintf("%dm %ds", int(d.Minutes()), int(d.Seconds())%60)
	}
	return fmt.Sprintf("%dh %dm", int(d.Hours()), int(d.Minutes())%60)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

func main() {
	host      := flag.String("host",     "localhost", "EventHive-C engine host")
	port      := flag.Int("port",        7000,        "Engine port")
	tenant    := flag.String("tenant",   "default",   "Tenant ID (X-Tenant-ID)")
	watch     := flag.Bool("watch",      false,       "Continuously poll the engine")
	interval  := flag.Int("interval",    5,           "Poll interval in seconds (--watch mode)")
	timeout   := flag.Int("timeout",     3000,        "Request timeout in milliseconds")
	jsonMode  := flag.Bool("json",       false,       "Output results as JSON")
	flag.Parse()

	run := func() {
		result := checkHealth(*host, *port, *tenant, *timeout)
		if *jsonMode {
			printJSON(result)
		} else {
			printTerminal(result)
		}
		if !result.Reachable {
			os.Exit(1)
		}
	}

	if *watch {
		fmt.Printf("  Watching %s:%d (tenant: %s) every %ds — Ctrl+C to stop\n\n",
			*host, *port, *tenant, *interval)
		for {
			run()
			time.Sleep(time.Duration(*interval) * time.Second)
		}
	} else {
		run()
	}
}
