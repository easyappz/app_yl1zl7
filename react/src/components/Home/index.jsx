import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div data-easytag="id1-react/src/components/Home/index.jsx" className="card">
      <h2>Добро пожаловать</h2>
      <p>Это простой сайт с регистрацией, авторизацией и профилем.</p>
      <div className="row">
        <Link className="button" to="/login">Войти</Link>
        <Link className="button" to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}
