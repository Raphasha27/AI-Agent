import { useEffect, useState } from "react";
import { getDeepHealth, getTasks } from "../services/api";
import {
    RiRobot2Line, RiTaskLine, RiBrainLine, RiFlashlightLine,
    RiGithubLine, RiExternalLinkLine,
} from "react-icons/ri";

export default function Dashboard() {
    const [health, setHealth] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        getDeepHealth().then((r) => setHealth(r.data)).catch(() => null);
        getTasks(5).then((r) => setTasks(r.data)).catch(() => null);
    }, []);

    const stats = [
        { icon: <RiTaskLine />, cls: "purple", value: tasks.length, label: "Total Tasks" },
        { icon: <RiRobot2Line />, cls: "cyan", value: 5, label: "Active Agents" },
        { icon: <RiBrainLine />, cls: "green", value: health?.memory?.total_vectors ?? 0, label: "Memory Vectors" },
        { icon: <RiFlashlightLine />, cls: "orange", value: health?.status === "healthy" ? "Online" : "–", label: "System Status" },
    ];

    return (
        <div className="animate-in">
            {/* ── Header ── */}
            <div className="page-header">
                <h1 className="page-title gradient-text">AI Agent Platform</h1>
                <p className="page-subtitle">
                    Autonomous multi-agent system — research, plan, code, and report.
                </p>
            </div>

            {/* ── Stats ── */}
            <div className="stats-grid">
                {stats.map((s, i) => (
                    <div key={i} className="card stat-card">
                        <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                        <div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Agents Overview ── */}
            <div style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "16px" }}>🤖 Agent Fleet</h2>
                <div className="cards-grid">
                    {AGENTS.map((a) => (
                        <div key={a.name} className="card" style={{ padding: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                                <span style={{ fontSize: "1.5rem" }}>{a.emoji}</span>
                                <div>
                                    <div style={{ fontWeight: "600", fontSize: "0.9375rem" }}>{a.name}</div>
                                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{a.type}</div>
                                </div>
                            </div>
                            <p style={{ color: "#94a3b8", fontSize: "0.8125rem", lineHeight: "1.6" }}>{a.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Quick Links ── */}
            <div className="card" style={{ padding: "20px" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "14px" }}>🔗 Quick Links</h2>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: "0.8125rem" }}>
                        <RiExternalLinkLine /> API Docs (Swagger)
                    </a>
                    <a href="https://github.com/Raphasha27/AI-Agent" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: "0.8125rem" }}>
                        <RiGithubLine /> GitHub Repository
                    </a>
                </div>
            </div>
        </div>
    );
}

const AGENTS = [
    { emoji: "🧭", name: "Coordinator Agent", type: "Orchestrator", desc: "Routes tasks to the right agents and assembles the final output." },
    { emoji: "📋", name: "Planner Agent", type: "Planning", desc: "Breaks complex goals into numbered, executable steps." },
    { emoji: "🔎", name: "Research Agent", type: "Research", desc: "Searches the web and synthesises findings into clean summaries." },
    { emoji: "💻", name: "Coding Agent", type: "Engineering", desc: "Writes, reviews, and explains production-ready code." },
    { emoji: "📊", name: "Report Agent", type: "Reporting", desc: "Combines agent outputs into professional Markdown reports." },
];
