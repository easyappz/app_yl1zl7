import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../../api/auth";

export default function Register({ onAuthed }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await apiRegister({ name, email, phone, password });
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        if (onAuthed) onAuthed(data.token);
        navigate("/profile");
      } else {
        setError("Не удалось зарегистрироваться");
      }
    } catch (err) {
      const msg = err?.response?.data?.email?.[0] || err?.response?.data?.detail || "Ошибка регистрации";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-react/src/components/Register/index.jsx" className="card">
      <h2>Регистрация</h2>
      <form className="form" onSubmit={submit}>
        <label>
          Имя
          <input className="input" type="text" value={name} onChange={(e)=>setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </label>
        <label>
          Телефон
          <input className="input" type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </label>
        <label>
          Пароль
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="button" type="submit" disabled={loading}>{loading ? "Создаём..." : "Зарегистрироваться"}</button>
      </form>
    </div>
  );
}
