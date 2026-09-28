import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "./api/axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import AuthForm from "./components/AuthForm";

const FILTERS = { ALL: "all", ACTIVE: "active", COMPLETED: "completed" };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const handleAuth = (newToken, name) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", name);
    setToken(newToken);
    setUsername(name);
  };

  const logout = async () => {
    try { await api.post("/auth/logout/"); } catch (e) { /* ignore */ }
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setTasks([]);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tasks/");
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setTasks(data || []);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        return;
      }
      setError("Couldn't reach the server. Is the Django backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchTasks();
  }, [fetchTasks, token]);

  const addTask = async (payload) => {
    try {
      const res = await api.post("/tasks/", payload);
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      setError("Couldn't add the task. Check the backend and try again.");
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await api.patch(`/tasks/${id}/toggle/`);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      setError("Couldn't update the task.");
    }
  };

  const editTask = async (id, payload) => {
    try {
      const res = await api.patch(`/tasks/${id}/`, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      setError("Couldn't save your changes.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}/`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("Couldn't delete the task.");
    }
  };

  const visibleTasks = useMemo(() => {
    if (filter === FILTERS.ACTIVE) return tasks.filter((t) => !t.completed);
    if (filter === FILTERS.COMPLETED) return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const remaining = tasks.filter((t) => !t.completed).length;

  if (!token) {
    return (
      <div className="page">
        <div className="card">
          <header className="header">
            <h1>To-Do List</h1>
            <p className="subtitle">Log in to manage your tasks — by Sudeep</p>
          </header>
          <AuthForm onAuth={handleAuth} />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <header className="header">
          <h1>To-Do List</h1>
          <p className="subtitle">
            {username} · <button className="filter-btn" onClick={logout}>Log out</button>
          </p>
        </header>

        <TaskForm onAdd={addTask} />

        <div className="filter-row">
          {Object.values(FILTERS).map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className="remaining">{remaining} remaining</span>
        </div>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p className="empty-state">Loading tasks…</p>
        ) : (
          <TaskList
            tasks={visibleTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        )}
      </div>
    </div>
  );
}
