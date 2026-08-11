//importamos Schema y model de mongoose
import { Schema, model } from "mongoose";

//Esquema para el registro de Gastos
const gastoschema = new Schema(
  {
    cantidadGasto: { type: Number }, //Monto del gasto
    descripcionGasto: {type: String}, //Descripción del gasto
    fechaGasto: {type: Date}, //Fecha en que se realizó el gasto
  },
  {
    timestamps: true,
    strict: false,
  },
);

//Exportamos el modelo con el nombre de la colección "Gastos"
export default model("Gastos", gastoschema);