import { useState, useRef, useEffect } from "react";
import { chatAgent } from "../services/api";
import { RiSendPlanFill, RiRobot2Line, RiUser3Line, RiLoader4Line } from "react-icons/ri";
import toast from "react-hot-toast";

export default function AgentConsole() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "👋 Hello! I am your AI Agent. Give me any task — I will plan, research, and report back.",
            ts: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = async () => {
        const task = input.trim();
        if (!task || loading) return;

        setMessages((prev) => [...prev, { role: "user", content: task, ts: new Date() }]);
        setInput("");
        setLoading(true);

        try {
            const res = await chatAgent(task);
            const data = res.data;
            const report = data.report || data.outputs?.reporter || JSON.stringify(data.outputs, null, 2);

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: report, ts: new Date(), meta: data },
            ]);
        } catch (err) {
            toast.error("Agent request failed. Check your API key and backend.");
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "⚠️ Error connecting to backend. Please check your configuration.",
                    ts: new Date(),
                    error: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const onKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    return (
        <div style={styles.wrapper}>
            {/* Messages */}
            <div style={styles.messages}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ ...styles.msgRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                        {msg.role === "assistant" && (
                            <div style={styles.avatar}><RiRobot2Line size={16} /></div>
                        )}
                        <div style={{
                            ...styles.bubble,
                            ...(msg.role === "user" ? styles.bubbleUser : styles.bubbleBot),
                            ...(msg.error ? styles.bubbleError : {}),
                        }}>
                            <div style={styles.bubbleText}>{msg.content}</div>
                            <div style={styles.bubbleTime}>{msg.ts?.toLocaleTimeString()}</div>
                        </div>
                        {msg.role === "user" && (
                            <div style={{ ...styles.avatar, background: "rgba(99,102,241,0.2)", color: "#6366f1" }}>
                                <RiUser3Line size={16} />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
                        <div style={styles.avatar}><RiRobot2Line size={16} /></div>
                        <div style={{ ...styles.bubble, ...styles.bubbleBot }}>
                            <div style={styles.typing}>
                                <RiLoader4Line className="spin" size={16} />
                                <span>Agents are working…</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={styles.inputBar}>
                <textarea
                    id="agent-chat-input"
                    style={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKey}
                    placeholder="Describe a task for the AI agent… (Enter to send)"
                    rows={2}
                    disabled={loading}
                />
                <button
                    id="agent-send-btn"
                    onClick={send}
                    disabled={!input.trim() || loading}
                    style={styles.sendBtn}
                >
                    {loading ? <RiLoader4Line className="spin" size={18} /> : <RiSendPlanFill size={18} />}
                </button>
            </div>
        </div>
    );
}

const styles = {
    wrapper: { display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" },
    messages: { flex: 1, overflowY: "auto", padding: "8px 0", display: "flex", flexDirection: "column", gap: "16px" },
    msgRow: { display: "flex", alignItems: "flex-start", gap: "10px" },
    avatar: {
        width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
        background: "rgba(6,182,212,0.15)", color: "#06b6d4",
        display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px",
    },
    bubble: {
        maxWidth: "72%", borderRadius: "16px",
        padding: "12px 16px", fontSize: "0.9rem", lineHeight: "1.65",
    },
    bubbleBot: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#e2e8f0" },
    bubbleUser: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white" },
    bubbleError: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" },
    bubbleText: { whiteSpace: "pre-wrap", wordBreak: "break-word" },
    bubbleTime: { fontSize: "0.6875rem", opacity: 0.45, marginTop: "6px", textAlign: "right" },
    typing: { display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "0.875rem" },
    inputBar: {
        display: "flex", gap: "12px", alignItems: "flex-end",
        padding: "16px", background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", marginTop: "12px",
    },
    input: {
        flex: 1, background: "transparent", border: "none", outline: "none",
        color: "#f1f5f9", fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem",
        resize: "none", lineHeight: "1.6",
    },
    sendBtn: {
        width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        border: "none", color: "white", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 14px rgba(99,102,241,0.4)", transition: "all 0.2s",
    },
};
