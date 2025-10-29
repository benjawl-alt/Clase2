import React from "react";
import { Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Navbar from "./components/Navbar";

// Páginas principales
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Nosotros from "./pages/Nosotros";
import Formulario from "./pages/Formulario";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Blogs from "./pages/Blogs";
import Contacto from "./pages/Contacto";
import Comprobante_pago from "./pages/Comprobante_pago";
import Checkout from "./pages/Checkout";

// Panel de administración
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Ordenes from "./pages/admin/Ordenes";
import ProductosAdmin from "./pages/admin/ProductosAdmin";
import CategoriasAdmin from "./pages/admin/CategoriasAdmin";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";

import "./App.css";

function App() {
  return (
    <CarritoProvider>
      {/* 🔹 Navbar fijo arriba */}
      <Navbar />

      {/* 🔹 Contenedor general, con margen superior para no tapar contenido */}
      <div style={{ paddingTop: "80px" }}>
        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/comprobante" element={<Comprobante_pago />} />

          {/* 🔹 Panel de administración con subrutas */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} /> {/* /admin */}
            <Route path="dashboard" element={<Dashboard />} /> {/* /admin/dashboard */}
            <Route path="ordenes" element={<Ordenes />} />
            <Route path="productos" element={<ProductosAdmin />} />
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
          </Route>
        </Routes>
      </div>
    </CarritoProvider>
  );
}

export default App;
