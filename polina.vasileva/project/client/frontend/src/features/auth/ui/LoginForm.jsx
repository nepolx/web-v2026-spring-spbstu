import { useState } from "react";
import { loginRequest } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

export const LoginForm = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Заполните обязательное поле";
    if (!form.password) newErrors.password = "Заполните обязательное поле";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setErrors({});
  setServerError("");
  if (!validate()) return;
  try {
    const data = await loginRequest(form);
    localStorage.setItem("sessionId", data.sessionId);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/");
  } catch (err) {
    console.log(err);
    setServerError("Такого пользователя нет, проверьте логин или пароль");
  }
};

  return (
    <div className="login-card">
      <form onSubmit={handleSubmit} className="auth-form">

        <div className="input-group">
          <label className="paragraph-14">Логин</label>
          <span className="required">*</span>
          <input
            type="text"
            className={errors.username ? "input-error" : ""}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>

        <div className="input-group">
          <label className="paragraph-14">Пароль</label>
          <span className="required">*</span>
          <input
            type="password"
            className={errors.password ? "input-error" : ""}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        {serverError && <p className="error-text server">{serverError}</p>}

        <button type="submit" className="submit-btn">Войти</button>
      </form>
    </div>
  );
};