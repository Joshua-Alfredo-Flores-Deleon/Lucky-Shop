//Importamos la app y la coneccion a la base de datos
import app from "./app.js";
import "./database.js";

// Función asíncrona principal que inicializa el servidor en el puerto 4000
async function main() {
  app.listen(4000);
  console.log("server on port 4000");
}

// Llamada a la función principal para levantar el backend
main();