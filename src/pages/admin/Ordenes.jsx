import React, { useEffect, useState } from "react";

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [detalle, setDetalle] = useState(null); // 👈 Para mostrar detalle de una orden

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("compras")) || [];
    setOrdenes(data);
  }, []);

  const verDetalle = (orden) => {
    setDetalle(orden);
  };

  const cerrarDetalle = () => {
    setDetalle(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Órdenes</h1>

      {ordenes.length === 0 ? (
        <p>No hay órdenes registradas.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {ordenes.map((o, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                width: "300px",
                background: "#5c5151ff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3>Orden #{i + 1}</h3>
              <p>
                <strong>Total:</strong>{" "}
                ${o.total?.toLocaleString("es-CL") ?? 0}
              </p>
              {o.fecha && (
                <p>
                  <strong>Fecha:</strong> {o.fecha}
                </p>
              )}
              {o.usuario && (
                <p>
                  <strong>Usuario:</strong> {o.usuario}
                </p>
              )}
              <button
                onClick={() => verDetalle(o)}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Ver detalle
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detalle de boleta */}
      {detalle && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#5c5151ff",
              padding: "25px",
              borderRadius: "10px",
              maxWidth: "600px",
              width: "90%",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <h2>Detalle de la orden</h2>
            {detalle.fecha && <p><strong>Fecha:</strong> {detalle.fecha}</p>}
            {detalle.usuario && <p><strong>Cliente:</strong> {detalle.usuario}</p>}
            {detalle.metodo && <p><strong>Método de pago:</strong> {detalle.metodo}</p>}
            <hr />
            <h3>Productos:</h3>
            <ul>
              {detalle.items?.map((item, idx) => (
                <li key={idx}>
                  {item.marca} {item.modelo} — ${item.precio?.toLocaleString("es-CL")}
                </li>
              ))}
            </ul>
            <hr />
            <h3>Total: ${detalle.total?.toLocaleString("es-CL") ?? 0}</h3>

            <button
              onClick={cerrarDetalle}
              style={{
                marginTop: "15px",
                background: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
