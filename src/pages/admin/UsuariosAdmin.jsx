import React, { useEffect, useState } from "react";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [compras, setCompras] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", email: "" });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const dataUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const dataCompras = JSON.parse(localStorage.getItem("compras")) || [];
    setUsuarios(dataUsuarios);
    setCompras(dataCompras);
  }, []);

  const guardarUsuarios = (nuevos) => {
    setUsuarios(nuevos);
    localStorage.setItem("usuarios", JSON.stringify(nuevos));
  };

  const handleCrear = () => {
    if (!nuevoUsuario.nombre.trim() || !nuevoUsuario.email.trim())
      return alert("Completa todos los campos");

    const existe = usuarios.some((u) => u.email === nuevoUsuario.email);
    if (existe) return alert("Ya existe un usuario con ese correo");

    const nuevos = [...usuarios, nuevoUsuario];
    guardarUsuarios(nuevos);
    setNuevoUsuario({ nombre: "", email: "" });
  };

  const handleEditar = (i) => setEditando(i);

  const handleGuardarEdicion = (i) => {
    const nuevos = [...usuarios];
    nuevos[i] = { ...nuevos[i] };
    guardarUsuarios(nuevos);
    setEditando(null);
  };

  const handleEliminar = (i) => {
    if (window.confirm("¿Eliminar este usuario?")) {
      const nuevos = usuarios.filter((_, idx) => idx !== i);
      guardarUsuarios(nuevos);
    }
  };

  // 🧾 Historial de compras del usuario
  const obtenerHistorial = (email) => {
    return compras.filter((c) => c.email === email);
  };

  return (
    <div style={styles.container}>
      <h1>Usuarios</h1>

      <div style={styles.crear}>
        <h3>Crear nuevo usuario</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoUsuario.nombre}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
          }
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={nuevoUsuario.email}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
          }
          style={styles.input}
        />
        <button onClick={handleCrear} style={styles.btnCrear}>
          Agregar usuario
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <ul style={styles.lista}>
          {usuarios.map((u, i) => (
            <li key={i} style={styles.usuario}>
              {editando === i ? (
                <div>
                  <input
                    type="text"
                    value={u.nombre}
                    onChange={(e) => {
                      const nuevos = [...usuarios];
                      nuevos[i].nombre = e.target.value;
                      setUsuarios(nuevos);
                    }}
                    style={styles.input}
                  />
                  <input
                    type="email"
                    value={u.email}
                    onChange={(e) => {
                      const nuevos = [...usuarios];
                      nuevos[i].email = e.target.value;
                      setUsuarios(nuevos);
                    }}
                    style={styles.input}
                  />
                  <button
                    onClick={() => handleGuardarEdicion(i)}
                    style={styles.btnGuardar}
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <>
                  <p>
                    <b>{u.nombre}</b> — {u.email}
                  </p>
                  <div style={styles.botones}>
                    <button onClick={() => handleEditar(i)} style={styles.btnEditar}>
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(i)} style={styles.btnEliminar}>
                      Eliminar
                    </button>
                  </div>

                  {/* 🧾 Historial */}
                  <div style={styles.historial}>
                    <h4>Historial de compras:</h4>
                    {obtenerHistorial(u.email).length === 0 ? (
                      <p style={{ color: "#888" }}>Sin compras registradas.</p>
                    ) : (
                      <ul>
                        {obtenerHistorial(u.email).map((c) => (
                          <li key={c.id} style={styles.compra}>
                            <b>Fecha:</b> {c.fecha} — <b>Total:</b> $
                            {c.total?.toLocaleString("es-CL") ?? 0}
                            <details style={{ marginTop: "4px" }}>
                              <summary>Ver productos</summary>
                              {Array.isArray(c.items) && c.items.length > 0 ? (
                                <ul>
                                  {c.items.map((item, idx) => (
                                    <li key={idx}>
                                      {item.marca} {item.modelo} — $
                                      {item.precio?.toLocaleString("es-CL") ?? 0}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p style={{ color: "#888" }}>
                                  No hay detalles de productos.
                                </p>
                              )}
                            </details>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "30px", maxWidth: "700px", margin: "auto" },
  crear: { marginBottom: "20px" },
  input: {
    display: "block",
    width: "100%",
    margin: "5px 0",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  lista: { listStyle: "none", padding: 0 },
  usuario: {
    background: "#5c5353ff",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  botones: { display: "flex", gap: "8px", marginTop: "6px" },
  btnCrear: {
    background: "#2980b9",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnEditar: {
    background: "#f1c40f",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnEliminar: {
    background: "#e74c3c",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
  btnGuardar: {
    background: "#27ae60",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    marginTop: "4px",
  },
  historial: { marginTop: "10px", paddingLeft: "10px" },
  compra: {
    background: "#5c5353ff",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "6px",
    border: "1px solid #eee",
  },
};
