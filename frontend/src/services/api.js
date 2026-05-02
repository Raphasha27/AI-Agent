import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
});

// ── Request interceptor ────────────────────────────────────────────────────
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Response interceptor ───────────────────────────────────────────────────
API.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("[API Error]", err.response?.data || err.message);
        return Promise.reject(err);
    }
);

// ── Agent endpoints ────────────────────────────────────────────────────────
export const runAgent = (task, mode = "full") => API.post("/agent/run", { task, mode });
export const chatAgent = (task) => API.post("/agent/chat", { task });

// ── Task endpoints ─────────────────────────────────────────────────────────
export const getTasks = (limit = 50, offset = 0) => API.get(`/tasks/?limit=${limit}&offset=${offset}`);
export const createTask = (title, description) => API.post("/tasks/", { title, description });
export const getTask = (id) => API.get(`/tasks/${id}`);
export const updateTask = (id, status, result) => API.patch(`/tasks/${id}/status`, { status, result });
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// ── Health endpoints ───────────────────────────────────────────────────────
export const getHealth = () => API.get("/health/");
export const getDeepHealth = () => API.get("/health/deep");

export default API;
