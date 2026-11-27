import { useState } from "react";
import { Link } from "react-router-dom";
import { api, setToken } from "../api.js";
import Logo from "../components/Logo.jsx";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await api("/admin/login", { method: "POST", body: { username, password } });
      setToken(token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <div className="admin-login__brand">
          <Logo />
          <span>Admin Portal</span>
        </div>
        <h1>Sign in</h1>
        <p className="muted">Manage properties, vehicles, enquiries and directors.</p>
        <label className="field">
          <span>Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus required />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn--gold btn--block" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <Link to="/" className="admin-login__back">← Back to website</Link>
      </form>
    </div>
  );
}
