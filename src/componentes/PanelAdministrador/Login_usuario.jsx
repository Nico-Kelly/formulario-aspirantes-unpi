import React, { useState } from "react";
import { API_BASE_URL } from "../../config/api";

export function LoginUsuario({ onLoginExitoso }) {
  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
  });

  const handleInputCambio = (e) => {
    const { name, value } = e.target;
    setCredenciales((prevCredenciales) => ({
      ...prevCredenciales,
      [name]: value,
    }));
  };

  const handleSumbitLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credenciales)
    });


    if (!res.ok) {
      alert("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.");
      return;
    }

    const data = await res.json();
    const token = data.token;
    localStorage.setItem("token", token);

    if (res.ok) {
      alert("¡Inicio de sesión exitoso!");
      onLoginExitoso();
    }
  }


return (
  <div className="container p-2">
    <div className="card mx-auto" style={{ maxWidth: "400px" }}>
      <div className="card-body">
        <h5 className="text-center mb-3">Acceso Panel de Control</h5>
        <img className="logo d-block mx-auto mb-4" src="./logo-unpi.png" alt="logo-unpi" />
        <form onSubmit={handleSumbitLogin}>
          <div className="mb-3 text-start">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credenciales.email}
              onChange={handleInputCambio}
              required
            />
          </div>
          <div className="mb-4 text-start">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credenciales.password}
              onChange={handleInputCambio}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>

          {/* Nuevo enlace para crear cuenta */}
          <div className="text-center mt-3">
            <span className="text-muted small">¿No tienes cuenta? </span>
            <a href="#/" className="text-decoration-none fw-bold small" style={{ color: "#0d6efd" }}>
              Crea una cuenta
            </a>
          </div>

        </form>
      </div>
    </div>
  </div>
);
}