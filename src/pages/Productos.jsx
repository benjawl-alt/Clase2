import React, { useContext, useState, useEffect } from "react";
import productosData from "../../data/dataProductos";
import { CarritoContext } from "../context/CarritoContext";

const Productos = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [mensaje, setMensaje] = useState("");
  const { agregarAlCarrito, usuario } = useContext(CarritoContext);
  const [categorias, setCategorias] = useState(["Todos"]);
  const [productos, setProductos] = useState([]);

  // 🧠 Cargar productos combinando dataProductos + localStorage
  const cargarProductos = () => {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];

    // 🔄 Fusiona productos base con los guardados, evitando duplicados por ID
    const fusionados = [
      ...productosData,
      ...guardados.filter(
        (nuevo) => !productosData.some((base) => base.id === nuevo.id)
      ),
    ];

    // 🧷 Guarda la versión fusionada en localStorage
    localStorage.setItem("productos", JSON.stringify(fusionados));

    setProductos(fusionados);
  };

  // 🧩 Cargar categorías base + las creadas por admin
  const cargarCategorias = () => {
    const base = ["Sedán", "SUV", "Deportivo"];
    const guardadas = JSON.parse(localStorage.getItem("categorias")) || [];
    const todas = Array.from(new Set([...base, ...guardadas]));
    setCategorias(["Todos", ...todas]);
  };

  // 🧩 useEffect principal
  useEffect(() => {
    cargarProductos();
    cargarCategorias();

    const actualizar = () => {
      cargarProductos();
      cargarCategorias();
    };

    // 🔁 Escuchar eventos globales cuando el admin edita productos o categorías
    window.addEventListener("productosActualizados", actualizar);
    window.addEventListener("categoriasActualizadas", actualizar);
    window.addEventListener("storage", actualizar);

    return () => {
      window.removeEventListener("productosActualizados", actualizar);
      window.removeEventListener("categoriasActualizadas", actualizar);
      window.removeEventListener("storage", actualizar);
    };
  }, []);

  // 🧮 Filtrar productos según la categoría seleccionada
  const productosFiltrados =
    categoriaSeleccionada === "Todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaSeleccionada);

  // 🛒 Agregar producto al carrito
  const handleAgregar = (producto) => {
    if (!usuario) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }
    agregarAlCarrito(producto);
    setMensaje(`${producto.marca} ${producto.modelo} agregado al carrito.`);
  };

  // 🕒 Quitar mensaje después de 2.5 segundos
  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(() => setMensaje(""), 2500);
    return () => clearTimeout(timer);
  }, [mensaje]);

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Catálogo de Autos</h2>

      {/* 🔽 Filtros de categorías */}
      <div style={styles.filtros}>
        {categorias.map((categoria) => (
          <button
            key={categoria}
            onClick={() => setCategoriaSeleccionada(categoria)}
            style={{
              ...styles.boton,
              backgroundColor:
                categoriaSeleccionada === categoria ? "#333" : "#555",
            }}
          >
            {categoria}
          </button>
        ))}
      </div>

      {mensaje && <div style={styles.mensajeExito}>{mensaje}</div>}

      {/* 🧱 Grilla de productos */}
      <div style={styles.grid}>
        {productosFiltrados.length === 0 ? (
          <p style={{ color: "#fff" }}>No hay productos en esta categoría.</p>
        ) : (
          productosFiltrados.map((p) => (
            <div key={p.id} style={styles.card}>
              <img src={p.imagen} alt={p.modelo} style={styles.imagen} />
              <h3 style={styles.nombre}>
                {p.marca} {p.modelo}
              </h3>
              <p style={styles.precio}>${p.precio.toLocaleString("es-CL")}</p>
              <p style={styles.stock}>Stock disponible: {p.stock}</p>
              <button style={styles.btn} onClick={() => handleAgregar(p)}>
                Agregar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 🎨 Estilos visuales
const styles = {
  container: {
    padding: "30px",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "auto",
  },
  titulo: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#fff",
  },
  filtros: {
    marginBottom: "25px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  boton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#555",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
    justifyContent: "center",
    justifyItems: "center",
  },
  card: {
    backgroundColor: "#645c5cff",
    borderRadius: "15px",
    padding: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    textAlign: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    width: "100%",
    maxWidth: "320px",
  },
  imagen: {
    width: "100%",
    height: "220px",
    objectFit: "contain",
    borderRadius: "10px",
  },
  nombre: {
    marginTop: "10px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "#fff",
  },
  precio: {
    fontWeight: "bold",
    color: "#e8edf0ff",
    margin: "10px 0",
  },
  stock: {
    color: "#ddd",
    fontSize: "0.9rem",
  },
  btn: {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#4739389a",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Productos;
