import { useState } from "react";
import TaskList from "../components/TaskList";
import { createTask } from "../services/api";
import { RiAddLine, RiTaskLine } from "react-icons/ri";
import toast from "react-hot-toast";

export default function Tasks() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            await createTask(title.trim(), desc.trim() || undefined);
            toast.success("Task created!");
            setTitle(""); setDesc("");
            setRefresh((r) => r + 1);
        } catch {
            toast.error("Failed to create task.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <RiTaskLine style={{ color: "#6366f1" }} />
                    Tasks
                </h1>
                <p className="page-subtitle">Create, track, and manage agent tasks.</p>
            </div>

            {/* ── Create Form ── */}
            <div className="card" style={{ marginBottom: "28px", padding: "24px" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "16px" }}>➕ New Task</h2>
                <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="task-title">Task Title</label>
                        <input
                            id="task-title"
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="E.g. Research quantum computing trends"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="task-desc">Description (optional)</label>
                        <textarea
                            id="task-desc"
                            className="textarea"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Additional context for the agent…"
                            rows={2}
                        />
                    </div>
                    <button
                        id="create-task-btn"
                        type="submit"
                        className="btn btn-primary"
                        disabled={!title.trim() || loading}
                        style={{ alignSelf: "flex-start" }}
                    >
                        {loading ? "Creating…" : <><RiAddLine /> Create Task</>}
                    </button>
                </form>
            </div>

            {/* ── Task List ── */}
            <TaskList refresh={refresh} />
        </div>
    );
}
