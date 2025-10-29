import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";

const Formulario = () => {
  const { setUsuario } = useContext(CarritoContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmarPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const { nombre, correo, password, confirmarPassword } = formData;

    if (!nombre || !correo || !password || !confirmarPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // ✅ Guardar usuario registrado actual (para login)
    localStorage.setItem(
      "usuarioRegistrado",
      JSON.stringify({ nombre, correo, password })
    );

    // ✅ Guardar usuario nuevo en la lista global de usuarios (para el Admin)
    const usuariosPrevios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuariosPrevios.some((u) => u.correo === correo);

    if (!existe) {
      const nuevoUsuario = {
        id: Date.now(),
        nombre,
        correo,
        fechaRegistro: new Date().toISOString(),
      };
      localStorage.setItem(
        "usuarios",
        JSON.stringify([...usuariosPrevios, nuevoUsuario])
      );
    }

    setUsuario(nombre);
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Registro de Usuario</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="confirmarPassword"
          placeholder="Confirmar contraseña"
          value={formData.confirmarPassword}
          onChange={handleChange}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.btn}>
          Registrarse
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    maxWidth: "400px",
    margin: "40px auto",
    backgroundColor: "#2c2c2c",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    textAlign: "center",
    color: "#fff",
  },
  titulo: {
    marginBottom: "20px",
    fontSize: "1.8rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #555",
    backgroundColor: "#3b3b3b",
    color: "#fff",
  },
  btn: {
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  error: {
    color: "#e74c3c",
    fontSize: "0.9rem",
  },
};

export default Formulario;
