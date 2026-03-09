import AgentConsole from "../components/AgentConsole";
import { RiRobot2Line } from "react-icons/ri";

export default function AgentChat() {
    return (
        <div className="animate-in" style={{ height: "100%" }}>
            <div className="page-header" style={{ marginBottom: "20px" }}>
                <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <RiRobot2Line style={{ color: "#6366f1" }} />
                    Agent Chat
                </h1>
                <p className="page-subtitle">
                    Chat with the multi-agent AI system. Runs <strong>planner → researcher → reporter</strong> pipeline.
                </p>
            </div>
            <AgentConsole />
        </div>
    );
}
