import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import limiter from "./src/middlewares/limiter.js"
import loginAdminRoutes from "./src/routes/loginAdmin.js";
import loginClientesRoutes from "./src/routes/loginClientes.js";
import clientesRoutes from "./src/routes/clientes.js"
import registerClientesRoutes from "./src/routes/registerClientesRoute.js"
import logoutRoutes from "./src/routes/logout.js";
import gastosRoutes from "./src/routes/gastos.js"
import gananciasRoutes from "./src/routes/ganancias.js";
import productosRoutes from "./src/routes/productosRoutes.js";
import ventaRoutes from "./src/routes/venta.js";
import carritoRoutes from "./src/routes/carritoRoutes.js";
import bolsasRoutes from "./src/routes/bolsasRoute.js";
import combosCompradosRoutes from "./src/routes/combosCompradosRoutes.js";
import comboSuerteRoutes from "./src/routes/comboSuerteRoutes.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js";
import recoveryPasswordAdminRoutes from "./src/routes/recoveryPasswordAdmin.js";
import registerAdminRoutes from "./src/routes/registerAdmin.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

app.use(limiter)
app.use(cookieParser());
app.use(express.json());

app.use("/api/loginAdmin", loginAdminRoutes);
app.use("/api/loginClientes", loginClientesRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/registerClientes", registerClientesRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recoveryPassword", recoveryPasswordRoutes);
app.use("/api/recoveryPasswordAdmin", recoveryPasswordAdminRoutes);
app.use("/api/gastos", gastosRoutes);
app.use("/api/ganancias", gananciasRoutes);
app.use("/api/venta", ventaRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/bolsas", bolsasRoutes);
app.use("/api/comboSuerte", comboSuerteRoutes);
app.use("/api/combosComprados", combosCompradosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/registerAdmin", registerAdminRoutes);

export default app;