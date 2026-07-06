import { useState, useEffect } from "react";
import "./PagosModals.css";

const VALORES_INICIALES = { cantidadGasto: "", descripcionGasto: "", fechaGasto: "" };

// Sirve para crear (gasto=null) y para editar (gasto={ _id, cantidadGasto, descripcionGasto, fechaGasto }).
export default function ModalRegistrarGasto({ abierto, gasto, onCerrar, onGuardar, error }) {
  const [form, setForm] = useState(VALORES_INICIALES);
  const esEditar = !!gasto;

  // Cada vez que el modal se abre, arranca en blanco (crear) o con los datos del gasto (editar)
  useEffect(() => {
    if (!abierto) return;
    if (gasto) {
      setForm({
        cantidadGasto: gasto.cantidadGasto ?? "",
        descripcionGasto: gasto.descripcionGasto ?? "",
        fechaGasto: gasto.fechaGasto ? String(gasto.fechaGasto).slice(0, 10) : "",
      });
    } else {
      setForm(VALORES_INICIALES);
    }
  }, [abierto, gasto]);

  if (!abierto) return null;

  const actualizar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const manejarGuardar = (e) => {
    e.preventDefault();
    if (!form.cantidadGasto || !form.fechaGasto) return;
    onGuardar({ ...form, cantidadGasto: Number(form.cantidadGasto) });
  };

  return (
    <div className="modal-fondo">
      <div className="modal-panel mediano">
        <h2 className="modal-titulo">{esEditar ? "Editar gasto" : "Registrar gasto"}</h2>

        <form onSubmit={manejarGuardar} className="modal-form una-columna">
          <div>
            <label className="modal-campo-label">Monto del gasto</label>
            <div className="modal-precio-input">
              <span>$</span>
              <input
                className="modal-input"
                type="number"
                min="0"
                step="0.01"
                value={form.cantidadGasto}
                onChange={(e) => actualizar("cantidadGasto", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="modal-campo-label">Descripción</label>
            <input
              className="modal-input"
              value={form.descripcionGasto}
              onChange={(e) => actualizar("descripcionGasto", e.target.value)}
              placeholder="Ej. Compra de insumos"
            />
          </div>

          <div>
            <label className="modal-campo-label">Fecha</label>
            <input
              className="modal-input"
              type="date"
              value={form.fechaGasto}
              onChange={(e) => actualizar("fechaGasto", e.target.value)}
              required
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-acciones">
            <button type="button" className="modal-boton-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="modal-boton-primario">
              {esEditar ? "Guardar cambios" : "Guardar gasto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}