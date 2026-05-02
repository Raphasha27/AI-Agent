import { NavLink } from "react-router-dom";
import {
    RiRobot2Line,
    RiDashboardLine,
    RiChat3Line,
    RiTaskLine,
    RiGithubLine,
    RiCircleFill,
} from "react-icons/ri";

const navItems = [
    { to: "/dashboard", icon: <RiDashboardLine />, label: "Dashboard" },
    { to: "/chat", icon: <RiChat3Line />, label: "Agent Chat" },
    { to: "/tasks", icon: <RiTaskLine />, label: "Tasks" },
];

export default function Navbar() {
    return (
        <nav style={styles.nav}>
            {/* ── Logo ── */}
            <div style={styles.logo}>
                <div style={styles.logoIcon}><RiRobot2Line size={22} /></div>
                <div>
                    <div style={styles.logoText}>AI Agent</div>
                    <div style={styles.logoSub}>Platform v1.0</div>
                </div>
            </div>

            {/* ── Status pill ── */}
            <div style={styles.status}>
                <RiCircleFill size={8} color="#10b981" />
                <span>System Online</span>
            </div>

            {/* ── Nav links ── */}
            <ul style={styles.navList}>
                {navItems.map(({ to, icon, label }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
                        >
                            <span style={styles.navIcon}>{icon}</span>
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* ── Footer ── */}
            <div style={styles.footer}>
                <a
                    href="https://github.com/Raphasha27/AI-Agent"
                    target="_blank"
                    rel="noreferrer"
                    style={styles.ghLink}
                >
                    <RiGithubLine size={16} /> GitHub Repo
                </a>
                <div style={styles.credit}>Built by Koketso Raphasha</div>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        width: "240px", minHeight: "100vh", position: "fixed", top: 0, left: 0,
        background: "rgba(17,18,24,0.95)", borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)", display: "flex", flexDirection: "column",
        padding: "0", zIndex: 100,
    },
    logo: {
        display: "flex", alignItems: "center", gap: "12px",
        padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    logoIcon: {
        width: "40px", height: "40px", borderRadius: "10px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", flexShrink: 0, boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
    },
    logoText: { fontWeight: "700", fontSize: "0.9375rem", color: "#f1f5f9" },
    logoSub: { fontSize: "0.6875rem", color: "#64748b", marginTop: "1px" },

    status: {
        display: "flex", alignItems: "center", gap: "8px",
        margin: "14px 20px 8px", padding: "8px 12px", borderRadius: "8px",
        background: "rgba(16,185,129,0.1)", fontSize: "0.75rem", color: "#10b981",
    },

    navList: { listStyle: "none", padding: "8px 12px", flex: 1 },
    navLink: {
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 12px", borderRadius: "10px", color: "#94a3b8",
        fontSize: "0.875rem", fontWeight: "500", transition: "all 0.2s",
        textDecoration: "none",
    },
    navLinkActive: {
        background: "rgba(99,102,241,0.12)", color: "#f1f5f9",
        boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.25)",
    },
    navIcon: { fontSize: "1.1rem", display: "flex" },

    footer: { padding: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" },
    ghLink: {
        display: "flex", alignItems: "center", gap: "8px",
        color: "#64748b", fontSize: "0.8125rem", textDecoration: "none", marginBottom: "10px",
        transition: "color 0.2s",
    },
    credit: { fontSize: "0.6875rem", color: "#475569" },
};
