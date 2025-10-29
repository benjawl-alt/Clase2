import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";

const Carrito = () => {
  const { carrito, eliminarDelCarrito, usuario, actualizarCantidad } = useContext(CarritoContext);
  const navigate = useNavigate();

  if (!usuario)
    return <p style={styles.msg}>Debes iniciar sesión para ver tu carrito.</p>;

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handlePagar = () => {
  if (!carrito || carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("total", JSON.stringify(total));

  navigate("/checkout");
};

  return (
    <div style={styles.container}>
      <h2>Carrito de {usuario}</h2>

      {carrito.length === 0 ? (
        <p>No tienes productos en tu carrito.</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.imagen} alt={item.modelo} style={styles.img} />
                  </td>
                  <td>{item.marca} {item.modelo}</td>
                  <td>${item.precio.toLocaleString("es-CL")}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      style={styles.inputCantidad}
                      onChange={(e) =>
                        actualizarCantidad(item.id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                  <td>
                    <button
                      style={styles.btnEliminar}
                      onClick={() => eliminarDelCarrito(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: "20px" }}>Total: ${total.toLocaleString("es-CL")}</h3>
          <button style={styles.btnPagar} onClick={handlePagar}>
            Pagar
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "30px", textAlign: "center" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  img: { width: "70px", borderRadius: "6px" },
  btnEliminar: {
    background: "#e74c3c",
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  btnPagar: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "15px",
  },
  msg: { padding: "40px", textAlign: "center", fontSize: "1.1rem" },
};

export default Carrito;
