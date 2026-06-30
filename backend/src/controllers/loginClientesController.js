import cleintesModel from "../models/Clientes.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

const loginClientesController = {};

loginClientesController.login = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    const clienteFound = await cleintesModel.findOne({ email });

    if (!clienteFound) {
      return res.status(400).json({ message: "Cliente not found" });
    }

    if (clienteFound.timeOut && clienteFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    const isMatch = await bcrypt.compare(password, clienteFound.password);

    if (!isMatch) {
      clienteFound.loginAttemps = (clienteFound.loginAttemps || 0) + 1;

      if (clienteFound.loginAttemps >= 5) {
        clienteFound.timeOut = Date.now() + 5 * 60 * 1000;
        clienteFound.loginAttemps = 0;

        await clienteFound.save();

        return res
          .status(403)
          .json({ message: "Cuenta bloqueda por multiples intentos fallidos" });
      }

      await clienteFound.save();

      return res.status(401).json({message: "Contraseña incorrecta"})

    }
    

    clienteFound.loginAttemps = 0;
    clienteFound.timeOut = null;

    const token = jsonwebtoken.sign(
      { id: clienteFound._id, userType: "Clientes" },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    res.cookie("authCookie", token);

    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Verifica si hay una sesión de cliente activa (usado por el frontend para proteger rutas)
loginClientesController.checkSession = async (req, res) => {
  try {
    const token = req.cookies.authCookie;

    if (!token) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (decoded.userType !== "Clientes") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const clienteFound = await cleintesModel.findById(decoded.id).select("-password");

    if (!clienteFound) {
      return res.status(401).json({ message: "No autenticado" });
    }

    return res.status(200).json({
      message: "Sesión activa",
      cliente: { email: clienteFound.email, name: clienteFound.name },
    });
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default loginClientesController;