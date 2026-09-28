import React, { useState } from "react";
import api from "../api/axios";

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { username, password };
      if (mode === "register") payload.email = email;
      const res = await api.post(`/auth/${mode}/`, payload);
      onAuth(res.data.token, res.data.username);
    } catch (err) {
      const data = err.response && err.response.data;
      setError(
        (data && (data.detail || Object.values(data).flat().join(" "))) ||
          "Couldn't reach the server."
      );
    }
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input
        className="task-input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {mode === "register" && (
        <input
          className="task-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}
      <input
        className="task-input"
        type="password"
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="form-error">{error}</p>}
      <div className="task-actions">
        <button className="btn btn-primary" type="submit">
          {mode === "login" ? "Log in" : "Create account"}
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Need an account?" : "Have an account?"}
        </button>
      </div>
    </form>
  );
}
