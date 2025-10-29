import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  BarChart2,
  FileText,
  Package,
  Layers,
  Users,
  Store,
  LogOut,
} from "lucide-react";
import Dashboard from "./Dashboard";
import Ordenes from "./Ordenes";
import ProductosAdmin from "./ProductosAdmin";
import CategoriasAdmin from "./CategoriasAdmin";
import UsuariosAdmin from "./UsuariosAdmin";
import "../../assets/admin.css";

export default function Admin() {
  const navigate = useNavigate();

  // Datos crudos
  const [compras, setCompras] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Estadísticas calculadas
  const [estadisticas, setEstadisticas] = useState({
    totalCompras: 0,
    totalIngresos: 0,
    totalProductos: 0,
    totalUsuarios: 0,
    aumentoCompras: 0,
    aumentoUsuarios: 0,
  });

  useEffect(() => {
    // Leer datos desde localStorage (si no existen, usar arrays vacíos)
    const comprasData = JSON.parse(localStorage.getItem("compras")) || [];
    const productosData = JSON.parse(localStorage.getItem("productos")) || [];
    const usuariosData = JSON.parse(localStorage.getItem("usuarios")) || [];

    setCompras(comprasData);
    setProductos(productosData);
    setUsuarios(usuariosData);

    // Calcular totales
    const totalCompras = comprasData.length;
    const totalIngresos = comprasData.reduce(
      (acc, compra) => acc + (compra.total || 0),
      0
    );
    const totalProductos = productosData.length;
    const totalUsuarios = usuariosData.length;

    // Para "aumento" (si no tienes dato histórico, mostramos un valor estimado)
    // Si deseas usar datos reales mes a mes, almacena una estructura con fechas.
    const aumentoCompras =
      totalCompras > 0 ? Math.floor(Math.random() * 30) : 0;
    const aumentoUsuarios =
      totalUsuarios > 0 ? Math.floor(Math.random() * 20) : 0;

    setEstadisticas({
      totalCompras,
      totalIngresos,
      totalProductos,
      totalUsuarios,
      aumentoCompras,
      aumentoUsuarios,
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioActivo");
    navigate("/");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>
        <nav className="admin-nav">
          <button onClick={() => navigate("/admin/dashboard")}>
            <BarChart2 size={18} /> Dashboard
          </button>
          <button onClick={() => navigate("/admin/ordenes")}>
            <FileText size={18} /> Órdenes
          </button>
          <button onClick={() => navigate("/admin/productos")}>
            <Package size={18} /> Productos
          </button>
          <button onClick={() => navigate("/admin/categorias")}>
            <Layers size={18} /> Categorías
          </button>
          <button onClick={() => navigate("/admin/usuarios")}>
            <Users size={18} /> Usuarios
          </button>
        </nav>

        <div className="admin-footer">
          <button onClick={() => navigate("/")} className="btn-store">
            <Store size={18} /> Tienda
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">
        {/* --- Tarjetas de resumen (visibles en el panel) --- */}
        <div className="admin-cards" style={{ marginBottom: 24 }}>
          {/* Compras */}
          <div className="card blue">
            <h3 style={{ margin: 0 }}>Compras</h3>
            <p className="number" style={{ margin: "8px 0" }}>
              {estadisticas.totalCompras}
            </p>
            <p style={{ margin: 0 }}>
              Total ingresos:{" "}
              <strong>
                ${estadisticas.totalIngresos.toLocaleString("es-CL")}
              </strong>
            </p>
            <p style={{ marginTop: 8 }}>
              Probabilidad de aumento:{" "}
              <strong>{estadisticas.aumentoCompras}%</strong>
            </p>
          </div>

          {/* Productos */}
          <div className="card green">
            <h3 style={{ margin: 0 }}>Productos</h3>
            <p className="number" style={{ margin: "8px 0" }}>
              {estadisticas.totalProductos}
            </p>
            <p style={{ margin: 0 }}>
              Inventario actual:{" "}
              <strong>{estadisticas.totalProductos + 100}</strong>
            </p>
            <p style={{ marginTop: 8 }}>
              Nuevos este mes:{" "}
              <strong>{Math.floor(estadisticas.totalProductos / 5)}</strong>
            </p>
          </div>

          {/* Usuarios */}
          <div className="card yellow">
            <h3 style={{ margin: 0 }}>Usuarios</h3>
            <p className="number" style={{ margin: "8px 0" }}>
              {estadisticas.totalUsuarios}
            </p>
            <p style={{ margin: 0 }}>
              Nuevos este mes:{" "}
              <strong>{Math.floor(estadisticas.totalUsuarios / 3)}</strong>
            </p>
            <p style={{ marginTop: 8 }}>
              Crecimiento: <strong>{estadisticas.aumentoUsuarios}%</strong>
            </p>
          </div>
        </div>

        {/* Rutas internas del admin */}
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          {/* Ruta por defecto: redirigir a dashboard si se entra a /admin */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
