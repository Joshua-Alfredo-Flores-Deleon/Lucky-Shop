//importamos mongoose y el config

import mongoose from "mongoose";
import { config } from "./config.js";

// Conectar a la base de datos usando la URI de configuración
mongoose.connect(config.db.URI);

// Referencia a la conexión de Mongoose
const connection = mongoose.connection;

//mensaje de cuando la conexión se abre correctamente
connection.once("open", () => {
  console.log("DB is connected");
});

//cuando se pierde la conexión a la base de datos
connection.on("disconnected", (error) => {
  console.log("DB is disconnected" + error);
});

//cuando ocurre un error en la conexión
connection.on("error", (error) => {
  console.log("error found" + error);
});