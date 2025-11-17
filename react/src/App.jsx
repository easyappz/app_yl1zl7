import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import "./App.css";
import { logout as apiLogout } from "./api/auth";

function AppInner() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null));

  useEffect(() => {
    const routes = ["/", "/login", "/register", "/profile"];
    if (typeof window !== "undefined" && typeof window.handleRoutes === "function") {
      try { window.handleRoutes(routes); } catch (e) {}
    }
  }, []);

  const handleLogout = async () => {
    try { await apiLogout(); } catch (e) {}
    try { localStorage.removeItem("token"); } catch (e) {}
    setToken(null);
    navigate("/login");
  };

  return (
    <div data-easytag="id1-react/src/App.jsx">
      <header className="app-header">
        <nav className="nav">
          <Link className="nav-logo" to="/">Мини-сайт</Link>
          <div className="nav-links">
            {!token && (
              <>
                <Link to="/login">Войти</Link>
                <Link to="/register">Регистрация</Link>
              </>
            )}
            {token && (
              <>
                <Link to="/profile">Профиль</Link>
                <button className="linklike" onClick={handleLogout}>Выйти</button>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onAuthed={(t)=>{setToken(t);}} />} />
          <Route path="/register" element={<Register onAuthed={(t)=>{setToken(t);}} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
