import { useState, useEffect } from "react";
import "./PagosModals.css";

const VALORES_INICIALES = {
  cliente: "",
  monto: "",
  metodo: "Transferencia",
  fecha: "",
  producto: "",
  detalleProducto: "",
  estado: "Completado",
};

export default function ModalAgregarPago({ abierto, onCerrar, onGuardar, error }) {
  const [form, setForm] = useState(VALORES_INICIALES);

  useEffect(() => {
    if (abierto) setForm(VALORES_INICIALES);
  }, [abierto]);

  if (!abierto) return null;

  const actualizar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const manejarGuardar = (e) => {
    e.preventDefault();
    if (!form.cliente || !form.monto || !form.fecha) return;
    onGuardar({ ...form, monto: Number(form.monto) });
  };

  return (
    <div className="modal-fondo">
      <div className="modal-panel grande">
        <h2 className="modal-titulo">Agregar pago</h2>

        <form onSubmit={manejarGuardar} className="modal-form">
          <div className="modal-columna-completa">
            <label className="modal-campo-label">Cliente</label>
            <input className="modal-input" value={form.cliente} onChange={(e) => actualizar("cliente", e.target.value)} required />
          </div>

          <div>
            <label className="modal-campo-label">Monto</label>
            <input
              className="modal-input"
              type="number"
              value={form.monto}
              onChange={(e) => actualizar("monto", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="modal-campo-label">Método de pago</label>
            <select className="modal-select" value={form.metodo} onChange={(e) => actualizar("metodo", e.target.value)}>
              <option>Transferencia</option>
              <option>Efectivo</option>
            </select>
          </div>

          <div>
            <label className="modal-campo-label">Fecha de pago</label>
            <input
              className="modal-input"
              type="date"
              value={form.fecha}
              onChange={(e) => actualizar("fecha", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="modal-campo-label">Estado</label>
            <select className="modal-select" value={form.estado} onChange={(e) => actualizar("estado", e.target.value)}>
              <option>Completado</option>
              <option>Pendiente</option>
            </select>
          </div>

          <div>
            <label className="modal-campo-label">Producto</label>
            <input className="modal-input" value={form.producto} onChange={(e) => actualizar("producto", e.target.value)} />
          </div>

          <div>
            <label className="modal-campo-label">Detalle del producto</label>
            <input
              className="modal-input"
              value={form.detalleProducto}
              onChange={(e) => actualizar("detalleProducto", e.target.value)}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-acciones">
            <button type="button" className="modal-boton-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="modal-boton-primario">
              Guardar pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}