import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/api";
import { RiDeleteBinLine, RiLoader4Line, RiRefreshLine } from "react-icons/ri";
import toast from "react-hot-toast";

const STATUS_CLASS = {
    pending: "badge-pending",
    running: "badge-running",
    completed: "badge-completed",
    failed: "badge-failed",
};

export default function TaskList({ refresh }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getTasks();
            setTasks(res.data);
        } catch {
            toast.error("Failed to load tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [refresh]);

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
            toast.success("Task deleted.");
        } catch {
            toast.error("Failed to delete task.");
        }
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <RiLoader4Line className="spin" size={28} color="#6366f1" />
        </div>
    );

    if (!tasks.length) return (
        <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No tasks yet</div>
            <p>Create your first task using the form above.</p>
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
                <button className="btn btn-ghost" onClick={load} style={{ padding: "6px 12px", fontSize: "0.8125rem" }}>
                    <RiRefreshLine /> Refresh
                </button>
            </div>

            {tasks.map((task) => (
                <div key={task.id} className="card animate-in" style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                <span style={{ fontWeight: "600", fontSize: "0.9375rem", truncate: true }}>{task.title}</span>
                                <span className={`badge ${STATUS_CLASS[task.status] || "badge-pending"}`}>
                                    <span className="badge-dot" />
                                    {task.status}
                                </span>
                            </div>
                            {task.description && (
                                <p style={{ color: "#94a3b8", fontSize: "0.8125rem", marginBottom: "8px" }}>{task.description}</p>
                            )}
                            {task.agent_used && (
                                <span style={{ fontSize: "0.75rem", color: "#6366f1" }}>Agent: {task.agent_used}</span>
                            )}
                            <div style={{ fontSize: "0.6875rem", color: "#475569", marginTop: "6px" }}>
                                Created: {new Date(task.created_at).toLocaleString()}
                            </div>
                        </div>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(task.id)}
                            style={{ padding: "6px 10px", flexShrink: 0, marginLeft: "12px" }}
                        >
                            <RiDeleteBinLine />
                        </button>
                    </div>

                    {task.result && (
                        <div style={{ marginTop: "12px" }}>
                            <div className="divider" style={{ marginTop: "12px", marginBottom: "12px" }} />
                            <div className="code-block" style={{ maxHeight: "150px", fontSize: "0.78rem" }}>{task.result}</div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
