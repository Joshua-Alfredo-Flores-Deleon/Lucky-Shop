import { useState } from "react";
import { usePagos } from "../hooks/usePagos";
import ModalAgregarPago from "../components/ModalAgregarPago";
import ModalDetallePago from "../components/ModalDetallePago";
import ConfirmModal from "../components/ConfirmModal"; // ajusta la ruta a donde realmente lo tengas
import "./Pagos.css";

export default function Pagos() {
  const {
    pagos,
    cargando,
    error,
    busqueda,
    setBusqueda,
    estadisticas,
    pagoSeleccionado,
    verDetalle,
    cerrarDetalle,
    pagoAEliminar,
    pedirConfirmacionEliminar,
    cancelarEliminar,
    agregarPago,
    eliminarPago,
    iniciales,
  } = usePagos();

  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState(null);

  const manejarAgregarPago = async (datos) => {
    try {
      setErrorFormulario(null);
      await agregarPago(datos);
      setModalAgregarAbierto(false);
    } catch (err) {
      setErrorFormulario(err.message);
    }
  };

  const manejarEliminarPago = async (id) => {
    try {
      setErrorEliminar(null);
      await eliminarPago(id);
    } catch (err) {
      setErrorEliminar(err.message);
      alert(err.message); // ConfirmModal no tiene un slot para mostrar error inline
    }
  };

  return (
    <div className="pagos-pagina">
      <h1 className="pagos-titulo">Pagos</h1>
      <p className="pagos-subtitulo">Lleva el control de pagos realizados y pendientes</p>

      <div className="pagos-barra-acciones">
        <div className="pagos-buscador">
          <span className="pagos-buscador-icono">
            <IconoBuscar />
          </span>
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar" />
        </div>
        <button className="pagos-boton-agregar" onClick={() => setModalAgregarAbierto(true)}>
          <IconoMas />
          Agregar pago
        </button>
      </div>

      {error && <p className="pagos-estado-error">No se pudieron cargar los pagos: {error}</p>}

      <div className="pagos-tarjetas">
        <TarjetaEstadistica etiqueta="Total pagado" valor={`$${estadisticas.totalPagado.toFixed(2)}`} nota="Este mes" />
        <TarjetaEstadistica etiqueta="Pago pendiente" valor={`$${estadisticas.pagoPendiente.toFixed(2)}`} nota="Este mes" />
        <TarjetaEstadistica
          etiqueta="Método más usado"
          valor={estadisticas.metodoMasUsado}
          nota={`${estadisticas.usosMetodo} pagos realizados usando este método`}
        />
      </div>

      <div className="pagos-tabla-wrap">
        <table className="pagos-tabla">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={5} className="pagos-vacio">
                  Cargando pagos…
                </td>
              </tr>
            )}

            {!cargando &&
              pagos.map((pago) => (
                <tr key={pago.id}>
                  <td>
                    <div className="pagos-cliente">
                      <span className="pagos-avatar-iniciales">{iniciales(pago.cliente)}</span>
                      {pago.cliente}
                    </div>
                  </td>
                  <td>
                    <span className={`pagos-badge ${pago.estado === "Completado" ? "completado" : "pendiente"}`}>{pago.estado}</span>
                  </td>
                  <td>${pago.monto.toFixed(2)}</td>
                  <td>{pago.fecha ? new Date(pago.fecha).toLocaleDateString("es-SV") : "—"}</td>
                  <td>
                    <div className="pagos-acciones-fila">
                      <button className="pagos-boton-icono" onClick={() => verDetalle(pago)} aria-label="Ver detalle">
                        <IconoArchivo />
                      </button>
                      <button
                        className="pagos-boton-icono eliminar"
                        onClick={() => pedirConfirmacionEliminar(pago)}
                        aria-label="Eliminar pago"
                      >
                        <IconoBasura />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!cargando && pagos.length === 0 && (
              <tr>
                <td colSpan={5} className="pagos-vacio">
                  No se encontraron pagos con ese criterio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalAgregarPago
        abierto={modalAgregarAbierto}
        onCerrar={() => setModalAgregarAbierto(false)}
        onGuardar={manejarAgregarPago}
        error={errorFormulario}
      />

      <ModalDetallePago pago={pagoSeleccionado} onCerrar={cerrarDetalle} iniciales={iniciales} />

      <ConfirmModal
        isOpen={!!pagoAEliminar}
        title="Confirmación"
        message="¿Estás segura que deseas eliminar este registro de pago?"
        onConfirm={() => manejarEliminarPago(pagoAEliminar.id)}
        onCancel={cancelarEliminar}
      />
    </div>
  );
}

function TarjetaEstadistica({ etiqueta, valor, nota }) {
  return (
    <div className="pagos-tarjeta-stat">
      <p className="pagos-tarjeta-etiqueta">{etiqueta}</p>
      <p className="pagos-tarjeta-valor">{valor}</p>
      <p className="pagos-tarjeta-nota">{nota}</p>
    </div>
  );
}

function IconoBuscar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconoMas() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconoArchivo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function IconoBasura() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
    </svg>
  );
}