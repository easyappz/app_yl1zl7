import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

export default function Login({ onAuthed }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        if (onAuthed) onAuthed(data.token);
        navigate("/profile");
      } else {
        setError("Не удалось выполнить вход");
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || "Неверный email или пароль";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-react/src/components/Login/index.jsx" className="card">
      <h2>Вход</h2>
      <form className="form" onSubmit={submit}>
        <label>
          Email
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </label>
        <label>
          Пароль
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="button" type="submit" disabled={loading}>{loading ? "Входим..." : "Войти"}</button>
      </form>
    </div>
  );
}
