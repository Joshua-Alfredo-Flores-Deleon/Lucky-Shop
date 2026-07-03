import { useState } from "react";
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import Sidebar from "../components/sideBar";
import Nav from "../components/Nav";
import NotificacionesModal from "../components/NotificationsModal";
import { useFinanzas } from "../hooksP/useFinanzas";
//import ModalRegistrarGasto from "../components/ModalRegistrarGasto";
//import ModalExito from "../components/ModalExito";
import "../AdminShell.css";
import "./Finanzas.css";

const formatoMoneda = (n) => `$${Number(n).toFixed(2)}`;

export default function Finanzas() {
  const {
    cargando,
    error,
    tendencia,
    resumen,
    movimientos,
    hayMasMovimientos,
    mostrarTodo,
    toggleMostrarTodo,
    registrarGasto,
    ultimoGastoGuardado,
    limpiarUltimoGasto,
  } = useFinanzas();

  const [modalGastoAbierto, setModalGastoAbierto] = useState(false);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [filaAbierta, setFilaAbierta] = useState(null);
  const [errorGasto, setErrorGasto] = useState(null);
  const [notifAbierta, setNotifAbierta] = useState(false);

  const manejarGuardarGasto = async (datosGasto) => {
    try {
      setErrorGasto(null);
      await registrarGasto(datosGasto);
      setModalGastoAbierto(false);
      setModalExitoAbierto(true);
    } catch (err) {
      setErrorGasto(err.message);
    }
  };

  const cerrarModalExito = () => {
    setModalExitoAbierto(false);
    limpiarUltimoGasto();
  };

  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-main">
        <Nav openNotifications={() => setNotifAbierta(true)} />
        <div className="finanzas-pagina">
      <h1 className="finanzas-titulo">Finanzas</h1>

      {error && <p className="finanzas-estado-error">No se pudo cargar la información financiera: {error}</p>}

      {cargando ? (
        <p className="finanzas-estado">Cargando información financiera…</p>
      ) : (
        <>
          <div className="finanzas-cuerpo-superior">
            <div className="finanzas-tarjeta">
              <p className="finanzas-tarjeta-titulo">Tendencia de ingresos mensuales</p>
              <div className="finanzas-grafica">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tendencia}>
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(valor) => formatoMoneda(valor)} />
                    <Line type="monotone" dataKey="ingresos" stroke="#5aa06c" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="gastos" stroke="#e19bb0" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <button className="finanzas-boton-gasto" onClick={() => setModalGastoAbierto(true)}>
                Registrar gasto
              </button>
            </div>

            <div className="finanzas-tarjeta">
              <p className="finanzas-tarjeta-titulo" style={{ borderLeft: "none", paddingLeft: 0 }}>
                Resumen del periodo
              </p>
              <div className="finanzas-resumen-linea">
                <div>
                  <p className="finanzas-resumen-etiqueta">Ingresos totales</p>
                  <p className="finanzas-resumen-valor verde">{formatoMoneda(resumen.ingresosTotales)}</p>
                </div>
                <div>
                  <p className="finanzas-resumen-etiqueta">Pérdidas totales</p>
                  <p className="finanzas-resumen-valor rojo">{formatoMoneda(resumen.perdidasTotales)}</p>
                </div>
                <div>
                  <p className="finanzas-resumen-etiqueta">Balance total</p>
                  <p className="finanzas-resumen-valor verde">{formatoMoneda(resumen.balanceTotal)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="finanzas-tabla-wrap">
            <div className="finanzas-tabla-encabezado">
              <p>
                Últimas <span className="pill">movimientos</span> registrados
              </p>
              {hayMasMovimientos && (
                <button className="finanzas-boton-vertodo" onClick={toggleMostrarTodo}>
                  {mostrarTodo ? "Ver menos" : "Ver todos"}
                </button>
              )}
            </div>

            <table className="finanzas-tabla">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {movimientos.map((mov) => (
                  <FilaMovimiento
                    key={mov.id}
                    movimiento={mov}
                    abierta={filaAbierta === mov.id}
                    onToggle={() => setFilaAbierta(filaAbierta === mov.id ? null : mov.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ModalRegistrarGasto
        abierto={modalGastoAbierto}
        onCerrar={() => setModalGastoAbierto(false)}
        onGuardar={manejarGuardarGasto}
        error={errorGasto}
      />
      <ModalExito
        abierto={modalExitoAbierto}
        mensaje={
          ultimoGastoGuardado ? `Gasto de ${formatoMoneda(ultimoGastoGuardado.monto)} registrado satisfactoriamente` : "Gasto registrado satisfactoriamente"
        }
        onCerrar={cerrarModalExito}
      />
        </div>
      </main>
      <NotificacionesModal abierto={notifAbierta} onCerrar={() => setNotifAbierta(false)} />
    </div>
  );
}

function FilaMovimiento({ movimiento, abierta, onToggle }) {
  return (
    <>
      <tr>
        <td>{movimiento.cliente}</td>
        <td>{movimiento.producto}</td>
        <td className={movimiento.tipo === "gasto" ? "finanzas-monto-gasto" : ""}>
          {movimiento.tipo === "gasto" ? "-" : ""}
          {formatoMoneda(movimiento.monto)}
        </td>
        <td>
          <span className="finanzas-badge">{movimiento.estado}</span>
        </td>
        <td>{movimiento.fecha ? new Date(movimiento.fecha).toLocaleDateString("es-SV") : "—"}</td>
        <td style={{ textAlign: "right" }}>
          <button className="finanzas-boton-expandir" onClick={onToggle} aria-label="Ver más detalles">
            <IconoChevron abierta={abierta} />
          </button>
        </td>
      </tr>
      {abierta && (
        <tr className="finanzas-fila-detalle">
          <td colSpan={6}>Tipo de movimiento: {movimiento.tipo === "gasto" ? "Gasto" : "Ganancia"}</td>
        </tr>
      )}
    </>
  );
}

function IconoChevron({ abierta }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: abierta ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}