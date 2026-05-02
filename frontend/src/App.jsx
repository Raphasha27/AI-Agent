import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AgentChat from "./pages/AgentChat";
import Tasks from "./pages/Tasks";

export default function App() {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chat" element={<AgentChat />} />
                    <Route path="/tasks" element={<Tasks />} />
                </Routes>
            </main>
        </div>
    );
}
