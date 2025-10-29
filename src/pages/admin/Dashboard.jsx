import React, { useEffect, useState } from "react";
import "../../assets/admin.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    compras: 0,
    probabilidad: 0,
    productos: 0,
    inventario: 0,
    usuarios: 0,
    nuevosUsuarios: 0,
    crecimiento: 0,
  });

  const [mensajes, setMensajes] = useState([]);
  const [mostrarReportes, setMostrarReportes] = useState(false);

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const compras = JSON.parse(localStorage.getItem("compras")) || [];
    const mensajesGuardados = JSON.parse(localStorage.getItem("mensajesContacto")) || [];

    const totalCompras = compras.reduce(
      (acc, compra) => acc + (compra.total || 0),
      0
    );
    const inventario = productos.reduce(
      (acc, p) => acc + (p.stock || 0),
      0
    );

    const ahora = new Date();
    const nuevosUsuarios = usuarios.filter((u) => {
      const fecha = new Date(u.fechaRegistro || ahora);
      const diferencia = (ahora - fecha) / (1000 * 60 * 60 * 24);
      return diferencia <= 30;
    }).length;

    const probabilidad = Math.floor(Math.random() * 50) + 10;
    const crecimiento = Math.floor(Math.random() * 40);

    setStats({
      compras: totalCompras,
      probabilidad,
      productos: productos.length,
      inventario,
      usuarios: usuarios.length,
      nuevosUsuarios,
      crecimiento,
    });

    setMensajes(mensajesGuardados);
  }, []);

  return (
    <div className="admin-dashboard">
      <h1> Dashboard</h1>
      <p>Resumen general de tu tienda</p>

      <div className="admin-cards">
        <div className="card blue">
          <h3>Compras</h3>
          <p className="number">${stats.compras.toLocaleString("es-CL")}</p>
          <p>Probabilidad de aumento: {stats.probabilidad}%</p>
        </div>

        <div className="card green">
          <h3>Productos</h3>
          <p className="number">{stats.productos}</p>
          <p>Inventario actual: {stats.inventario}</p>
        </div>

        <div className="card yellow">
          <h3>Usuarios</h3>
          <p className="number">{stats.usuarios}</p>
          <p>Nuevos este mes: {stats.nuevosUsuarios}</p>
        </div>

        <div className="card purple">
          <h3>Crecimiento</h3>
          <p className="number">{stats.crecimiento}%</p>
          <p>Comparado con el mes pasado</p>
        </div>
      </div>

      {/* 🔽 Botón para mostrar/ocultar reportes */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          className="btn-reportes"
          onClick={() => setMostrarReportes(!mostrarReportes)}
        >
          {mostrarReportes ? "Ocultar reportes" : "Ver reportes de contacto"}
        </button>
      </div>

      {/* 🧾 Sección de reportes */}
      {mostrarReportes && (
        <div className="reportes-container">
          <h2>📨 Mensajes de contacto</h2>
          {mensajes.length === 0 ? (
            <p>No hay mensajes registrados.</p>
          ) : (
            <ul className="lista-mensajes">
              {mensajes.map((m, i) => (
                <li key={i} className="mensaje-card">
                  <p><strong>📅 Fecha:</strong> {m.fecha}</p>
                  <p><strong>👤 Nombre:</strong> {m.name}</p>
                  <p><strong>📧 Correo:</strong> {m.email}</p>
                  <p><strong>💬 Mensaje:</strong> {m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
