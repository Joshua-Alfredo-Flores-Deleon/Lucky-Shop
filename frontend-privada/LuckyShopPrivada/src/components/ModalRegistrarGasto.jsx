import { useState, useEffect } from "react";

// Estado inicial del formulario para cuando se registra un nuevo gasto
const VALORES_INICIALES = { cantidadGasto: "", descripcionGasto: "", fechaGasto: "" };

// Modal para crear un nuevo gasto o editar uno existente
export default function ModalRegistrarGasto({ abierto, gasto, onCerrar, onGuardar, error }) {
  // Estado local para los campos del formulario
  const [form, setForm] = useState(VALORES_INICIALES);
  
  // Determina si el modal está en modo edición o creación
  const esEditar = !!gasto;

  // Actualiza los datos del formulario según si se pasa un gasto para editar o si es nuevo
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

  // Si el modal está cerrado, no se muestra en pantalla
  if (!abierto) return null;

  // Función para actualizar un campo específico del formulario
  const actualizar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  // Procesa el envío del formulario formateando el monto a número
  const manejarGuardar = (e) => {
    e.preventDefault();
    if (!form.cantidadGasto || !form.fechaGasto) return;
    onGuardar({ ...form, cantidadGasto: Number(form.cantidadGasto) });
  };

  return (
    // Fondo oscuro que cubre la pantalla
    <div className="modal-fondo">
      {/* Contenedor principal del modal */}
      <div className="modal-panel mediano">
        {/* Título dinámico según la acción */}
        <h2 className="modal-titulo">{esEditar ? "Editar gasto" : "Registrar gasto"}</h2>

        {/* Formulario de registro/edición */}
        <form onSubmit={manejarGuardar} className="modal-form una-columna">
          {/* Campo de ingreso del monto */}
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

          {/* Campo de descripción opcional */}
          <div>
            <label className="modal-campo-label">Descripción</label>
            <input
              className="modal-input"
              value={form.descripcionGasto}
              onChange={(e) => actualizar("descripcionGasto", e.target.value)}
              placeholder="Ej. Compra de insumos"
            />
          </div>

          {/* Campo de selección de fecha */}
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

          {/* Muestra mensaje de error en caso de existir */}
          {error && <p className="modal-error">{error}</p>}

          {/* Botones de acción del formulario */}
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