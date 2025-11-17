import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateMe } from "../../api/profile";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const { data } = await getMe();
        setForm({ name: data.name || "", email: data.email || "", phone: data.phone || "" });
      } catch (e) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const { data } = await updateMe(form);
      setForm({ name: data.name || "", email: data.email || "", phone: data.phone || "" });
      setSuccess("Профиль обновлён");
    } catch (err) {
      const msg = err?.response?.data?.email?.[0] || err?.response?.data?.detail || "Ошибка сохранения";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div data-easytag="id1-react/src/components/Profile/index.jsx" className="card">Загрузка...</div>;

  return (
    <div data-easytag="id1-react/src/components/Profile/index.jsx" className="card">
      <h2>Профиль</h2>
      <form className="form" onSubmit={submit}>
        <label>
          Имя
          <input className="input" type="text" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
        </label>
        <label>
          Email
          <input className="input" type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} required />
        </label>
        <label>
          Телефон
          <input className="input" type="tel" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} />
        </label>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button className="button" type="submit" disabled={saving}>{saving ? "Сохраняем..." : "Сохранить"}</button>
      </form>
    </div>
  );
}
