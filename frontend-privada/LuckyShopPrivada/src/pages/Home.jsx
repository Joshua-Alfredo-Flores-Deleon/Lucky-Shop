import { useHome } from "../hooks/useHome";
import "./Home.css";

const formatoMoneda = (n) =>
  `$${Number(n).toLocaleString("es-SV", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Home() {
  const { cargando, error, resumen, tendencia, granularidad, cambiarGranularidad } = useHome();

  if (cargando) {
    return <p className="home-estado">Cargando panel…</p>;
  }

  if (error) {
    return <p className="home-estado-error">No se pudo cargar el panel: {error}</p>;
  }

  const valorMaximo = Math.max(...tendencia.map((t) => t.valor), 1);
  const indiceActivo = tendencia.length - 2 >= 0 ? tendencia.length - 2 : tendencia.length - 1;

  return (
    <div className="home-pagina">
      <div className="home-encabezado">
        <h1 className="home-titulo">Panel de control</h1>
        <div className="home-acciones">
          <button className="home-campana" aria-label="Notificaciones">
            <IconoCampana />
            <span className="home-campana-punto" />
          </button>
          <div className="home-avatar" />
        </div>
      </div>
      <p className="home-subtitulo">Bienvenido de nuevo, aquí está el resumen de este mes</p>

      <div className="home-tarjetas">
        <div className="home-tarjeta">
          <div className="home-tarjeta-fila">
            <div>
              <p className="home-tarjeta-titulo">Ventas totales</p>
              <p className="home-tarjeta-valor">{formatoMoneda(resumen.ventasTotales)}</p>
            </div>
            <div className="home-tarjeta-icono">
              <IconoDinero />
            </div>
          </div>
        </div>

        <div className="home-tarjeta">
          <div className="home-tarjeta-fila">
            <div>
              <p className="home-tarjeta-titulo">Clientes activos</p>
              <p className="home-tarjeta-valor">{resumen.clientesActivos}</p>
              <p className="home-tendencia-linea">
                <IconoFlechaArriba />
                {resumen.clientesNuevosEsteMes} más este mes
              </p>
            </div>
            <div className="home-tarjeta-icono verde">
              <IconoPersonas />
            </div>
          </div>
        </div>

        <div className="home-tarjeta">
          <div className="home-tarjeta-fila">
            <div>
              <p className="home-tarjeta-titulo">Productos nuevos</p>
              <p className="home-tarjeta-valor">
                +{resumen.productosNuevos}
                <IconoFlechaArriba inline />
              </p>
            </div>
            <div className="home-tarjeta-icono">
              <IconoCaja />
            </div>
          </div>
        </div>
      </div>

      <div className="home-cuerpo">
        <div className="home-tarjeta-grafica">
          <div className="home-grafica-encabezado">
            <p className="home-grafica-titulo">Tendencia de ventas</p>
            <div className="home-toggle">
              <button
                className={`home-toggle-boton ${granularidad === "mensual" ? "activo" : ""}`}
                onClick={() => cambiarGranularidad("mensual")}
              >
                Mensual
              </button>
              <button
                className={`home-toggle-boton ${granularidad === "semanal" ? "activo" : ""}`}
                onClick={() => cambiarGranularidad("semanal")}
              >
                Semanal
              </button>
            </div>
          </div>

          {tendencia.length === 0 ? (
            <p className="home-estado">Todavía no hay ventas registradas para graficar.</p>
          ) : (
            <div className="home-grafica-barras">
              {tendencia.map((punto, i) => (
                <div key={punto.etiqueta + i} className="home-barra-columna">
                  {i === indiceActivo && <span className="home-barra-globo">{formatoMoneda(punto.valor)}</span>}
                  <div
                    className={`home-barra ${i === indiceActivo ? "activa" : ""}`}
                    style={{ height: `${Math.max((punto.valor / valorMaximo) * 100, 4)}%` }}
                  />
                  <span className="home-barra-etiqueta">{punto.etiqueta}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="home-tarjeta-resumen"
          style={{ backgroundImage: "url(https://picsum.photos/seed/luckyshop/400/600)" }}
        >
          <p className="home-resumen-titulo">Resumen</p>
          <p className="home-resumen-texto">¡Luckyshop ha aumentado su popularidad este último mes!</p>
        </div>
      </div>
    </div>
  );
}

function IconoCampana() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconoDinero() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconoPersonas() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconoCaja() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8v13H3V8" />
      <path d="M1 3h22v5H1z" />
      <path d="M10 12h4" />
    </svg>
  );
}

function IconoFlechaArriba({ inline }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={inline ? { marginLeft: 6, color: "#3b6d11" } : undefined}
    >
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}