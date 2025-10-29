import React, { useEffect, useState } from "react";

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({
    marca: "",
    modelo: "",
    anio: "",
    precio: "",
    color: "",
    descripcion: "",
    categoria: "",
    imagen: "",
    stock: "",
  });
  const [editando, setEditando] = useState(null);
  const [editado, setEditado] = useState({});

  // 🧠 Cargar productos desde localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(data);
  }, []);

  // 💾 Guardar productos
  const guardarEnLocalStorage = (lista) => {
    localStorage.setItem("productos", JSON.stringify(lista));
    window.dispatchEvent(new Event("productosActualizados"));
  };

  // ➕ Agregar producto
  const agregarProducto = () => {
    if (!nuevo.marca || !nuevo.modelo || !nuevo.precio) {
      alert("Completa al menos marca, modelo y precio.");
      return;
    }

    const producto = {
      id: Date.now(),
      ...nuevo,
      anio: parseInt(nuevo.anio) || "",
      precio: parseFloat(nuevo.precio) || 0,
      stock: parseInt(nuevo.stock) || 0,
    };

    const nuevos = [...productos, producto];
    setProductos(nuevos);
    guardarEnLocalStorage(nuevos);

    setNuevo({
      marca: "",
      modelo: "",
      anio: "",
      precio: "",
      color: "",
      descripcion: "",
      categoria: "",
      imagen: "",
      stock: "",
    });
  };

  // 🗑️ Eliminar producto
  const eliminarProducto = (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    const nuevos = productos.filter((p) => p.id !== id);
    setProductos(nuevos);
    guardarEnLocalStorage(nuevos);
  };

  // ✏️ Editar producto
  const iniciarEdicion = (p) => {
    setEditando(p.id);
    setEditado({ ...p });
  };

  const guardarEdicion = () => {
    const nuevos = productos.map((p) =>
      p.id === editado.id ? editado : p
    );
    setProductos(nuevos);
    guardarEnLocalStorage(nuevos);
    setEditando(null);
    setEditado({});
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setEditado({});
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Productos</h1>

      {/* ➕ Nuevo producto */}
      <div style={styles.card}>
        <h3 style={{ marginBottom: "10px" }}>Agregar producto</h3>
        <div style={styles.formGrid}>
          {[
            ["marca", "Marca"],
            ["modelo", "Modelo"],
            ["anio", "Año", "number"],
            ["precio", "Precio", "number"],
            ["color", "Color"],
            ["categoria", "Categoría"],
            ["imagen", "URL Imagen"],
            ["stock", "Stock", "number"],
          ].map(([key, label, type]) => (
            <input
              key={key}
              type={type || "text"}
              placeholder={label}
              value={nuevo[key]}
              onChange={(e) => setNuevo({ ...nuevo, [key]: e.target.value })}
              style={styles.input}
            />
          ))}
          <textarea
            placeholder="Descripción"
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            style={{ ...styles.input, gridColumn: "span 2" }}
          />
        </div>
        <button onClick={agregarProducto} style={styles.addBtn}>
          Agregar producto
        </button>
      </div>

      <h3 style={{ marginTop: "30px" }}>Lista de productos ({productos.length})</h3>

      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <div style={styles.listContainer}>
          {productos.map((p) => (
            <div key={p.id} style={styles.productCard}>
              {p.imagen && (
                <img
                  src={p.imagen}
                  alt={p.modelo}
                  style={styles.image}
                />
              )}
              <div style={styles.info}>
                {editando === p.id ? (
                  <>
                    <div style={styles.editGrid}>
                      <input
                        value={editado.marca}
                        onChange={(e) =>
                          setEditado({ ...editado, marca: e.target.value })
                        }
                        placeholder="Marca"
                        style={styles.editInput}
                      />
                      <input
                        value={editado.modelo}
                        onChange={(e) =>
                          setEditado({ ...editado, modelo: e.target.value })
                        }
                        placeholder="Modelo"
                        style={styles.editInput}
                      />
                      <input
                        value={editado.anio}
                        onChange={(e) =>
                          setEditado({ ...editado, anio: e.target.value })
                        }
                        placeholder="Año"
                        style={styles.editInput}
                      />
                      <input
                        value={editado.precio}
                        onChange={(e) =>
                          setEditado({ ...editado, precio: e.target.value })
                        }
                        placeholder="Precio"
                        style={styles.editInput}
                      />
                    </div>
                    <button onClick={guardarEdicion} style={styles.saveBtn}>
                      Guardar
                    </button>
                    <button onClick={cancelarEdicion} style={styles.cancelBtn}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <h4 style={styles.productTitle}>
                      {p.marca} {p.modelo} ({p.anio})
                    </h4>
                    <p style={styles.desc}>{p.descripcion}</p>
                    <p style={styles.details}>
                       ${p.precio.toLocaleString("es-CL")} |  {p.categoria} |  {p.color} |  {p.stock} unidades
                    </p>
                    <div style={styles.actions}>
                      <button onClick={() => iniciarEdicion(p)} style={styles.editBtn}>
                        Editar
                      </button>
                      <button onClick={() => eliminarProducto(p.id)} style={styles.deleteBtn}>
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 🎨 Estilos
const styles = {
  container: {
    padding: "25px",
    maxWidth: "1000px",
    margin: "auto",
    color: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  card: {
    background: "#2a2a3d",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#3a3a4d",
    color: "#fff",
  },
  addBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4a8ef0",
    color: "#fff",
    cursor: "pointer",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "10px",
  },
  productCard: {
    display: "flex",
    alignItems: "flex-start",
    background: "#1e1e2f",
    padding: "15px",
    borderRadius: "10px",
    gap: "15px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
  },
  image: {
    width: "120px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  info: {
    flex: 1,
  },
  productTitle: {
    margin: "0 0 5px",
  },
  desc: {
    fontSize: "0.9rem",
    color: "#ccc",
  },
  details: {
    fontSize: "0.85rem",
    color: "#aaa",
  },
  actions: {
    marginTop: "8px",
    display: "flex",
    gap: "8px",
  },
  editBtn: {
    background: "#4a8ef0",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    padding: "6px 10px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#e74c3c",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    padding: "6px 10px",
    cursor: "pointer",
  },
  saveBtn: {
    background: "#2ecc71",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    padding: "6px 10px",
    marginTop: "5px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#555",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    padding: "6px 10px",
    marginLeft: "5px",
    cursor: "pointer",
  },
  editGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  },
  editInput: {
    padding: "6px",
    borderRadius: "6px",
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #555",
  },
};
