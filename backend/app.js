import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import limiter from "./src/middlewares/limiter.js"
import loginAdminRoutes from "./src/routes/loginAdmin.js";
import loginClientesRoutes from "./src/routes/loginClientes.js";
import clientesRoutes from "./src/routes/clientes.js"
import registerClientesRoutes from "./src/routes/registerClientesRoute.js"
import gastosRoutes from "./src/routes/gastos.js"
import gananciasRoutes from "./src/routes/ganancias.js";
import productosRoutes from "./src/routes/productosRoutes.js";


import ventaRoutes from "./src/models/venta.js";

//Creo una constante que guarde Express
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    // permitir el envío de cookies y credenciales
    credentials: true,
  }),
);

app.use(limiter)

app.use(cookieParser());

//Que acepte los json desde postman
app.use(express.json());
app.use ("/api/loginAdmin", loginAdminRoutes);
app.use ("/api/loginClientes", loginClientesRoutes);

app.use("/api/clientes", clientesRoutes);
app.use("/api/registerClientes", registerClientesRoutes);
app.use("/api/gastos", gastosRoutes)
app.use("/api/ganancias", gananciasRoutes)
app.use("/api/venta", ventaRoutes)
app.use("/api/productos", productosRoutes)


export default app;