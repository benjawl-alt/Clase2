import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";

const Comprobante_pago = () => {
  const [carrito, setCarrito] = useState([]);
  const [datos, setDatos] = useState({});
  const [total, setTotal] = useState(0);
  const { vaciarCarrito } = useContext(CarritoContext);
  const navigate = useNavigate();

  
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalGuardado = Number(localStorage.getItem("total")) || 0;
    const datosEntrega = JSON.parse(localStorage.getItem("datosEntrega")) || {};

    console.log("🧾 Datos cargados:", { carritoGuardado, totalGuardado, datosEntrega });

    setCarrito(carritoGuardado);
    setTotal(totalGuardado);
    setDatos(datosEntrega);
  }, []);

  
  const handleVolverInicio = () => {
    if (carrito.length === 0 || total === 0) {
      console.warn(" No se puede guardar una compra vacía.");
      navigate("/");
      return;
    }

    const comprasPrevias = JSON.parse(localStorage.getItem("compras")) || [];

    
    const nuevaCompra = {
      id: Date.now(),
      fecha: new Date().toLocaleString("es-CL"),
      usuario: datos.nombre || "Cliente",
      metodo: "Pago en línea",
      total: total,
      items: carrito.map((item) => ({
        marca: item.marca,
        modelo: item.modelo,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
    };

    
    const comprasFiltradas = comprasPrevias.filter(
      (c) => c.id !== nuevaCompra.id && c.total > 0 && c.items?.length > 0
    );

    
    localStorage.setItem("compras", JSON.stringify([...comprasFiltradas, nuevaCompra]));

    
    localStorage.removeItem("carrito");
    localStorage.removeItem("total");
    localStorage.removeItem("datosEntrega");

    if (vaciarCarrito) vaciarCarrito();

    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2> Comprobante de pago</h2>
      <p>
        Gracias por tu compra, <b>{datos.nombre || "Cliente"}</b>!
      </p>

      <h3>Resumen del pedido:</h3>
      {carrito.length > 0 ? (
        <ul>
          {carrito.map((item) => (
            <li key={item.id}>
              {item.marca} {item.modelo} x {item.cantidad} — $
              {(item.precio * item.cantidad).toLocaleString("es-CL")}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontró información del carrito.</p>
      )}

      <h3>Total pagado: ${total.toLocaleString("es-CL")}</h3>

      <h4>Datos de envío:</h4>
      {datos.calle ? (
        <>
          <p>
            {datos.calle}
            {datos.departamento ? `, Depto ${datos.departamento}` : ""},{" "}
            {datos.comuna}, {datos.region}
          </p>
          {datos.indicaciones && <p>Indicaciones: {datos.indicaciones}</p>}
        </>
      ) : (
        <p>No se encontraron datos de envío.</p>
      )}

      <p style={{ marginTop: "20px" }}>
        Te enviaremos la confirmación a:{" "}
        <b>{datos.correo || "correo no disponible"}</b>
      </p>

      <button style={styles.btnInicio} onClick={handleVolverInicio}>
        Volver al inicio
      </button>
    </div>
  );
};


const styles = {
  container: {
    padding: "30px",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "left",
    backgroundColor: "#6a6b74ff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    color: "white",
  },
  btnInicio: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Comprobante_pago;
