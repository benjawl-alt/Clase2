import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const { setUsuario } = useContext(CarritoContext);

  const manejarSubmit = (e) => {
    e.preventDefault();

    const adminEmail = "admin@tienda.com";
    const adminPassword = "admin123";
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioRegistrado"));

    if (email === adminEmail && password === adminPassword) {
      setMensaje("---Bienvenido Administrador---");
      localStorage.setItem("usuarioActivo", "Administrador");
      setUsuario("Administrador");
      setTimeout(() => navigate("/"), 1000);
      return;
    }

    if (!usuarioGuardado) {
      setMensaje("No hay usuarios registrados. Regístrate primero.");
      return;
    }

    if (usuarioGuardado.correo === email && usuarioGuardado.password === password) {
      setMensaje(`Inicio de sesión exitoso, bienvenido ${usuarioGuardado.nombre}!`);
      localStorage.setItem("usuarioActivo", usuarioGuardado.nombre);
      setUsuario(usuarioGuardado.nombre);
      setTimeout(() => navigate("/"), 1000);
    } else {
      setMensaje("Email o contraseña incorrectos ");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={manejarSubmit} noValidate>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px", borderRadius: "8px" }}>
          Ingresar
        </button>
      </form>

      {mensaje && (
        <p
          style={{
            marginTop: "15px",
            color: mensaje.includes("incorrectos") ? "red" : "green",
          }}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}
