import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import limiter from "./src/middlewares/limiter.js"
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

export default app;