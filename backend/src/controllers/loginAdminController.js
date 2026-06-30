import adminModel from "../models/admin.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

const loginAdminController = {};

loginAdminController.login = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    const adminFound = await adminModel.findOne({ email });

    if (!adminFound) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (adminFound.timeOut && adminFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    const isMatch = await bcrypt.compare(password, adminFound.password);

    if (!isMatch) {
      adminFound.loginAttemps = (adminFound.loginAttemps || 0) + 1;

      if (adminFound.loginAttemps >= 5) {
        adminFound.timeOut = Date.now() + 5 * 60 * 1000;
        adminFound.loginAttemps = 0;

        await adminFound.save();

        return res
          .status(403)
          .json({ message: "Cuenta bloqueda por multiples intentos fallidos" });
      }

      await adminFound.save();

      return res.status(401).json({message: "Contraseña incorrecta"})

    }
    

    adminFound.loginAttemps = 0;
    adminFound.timeOut = null;

    const token = jsonwebtoken.sign(
      { id: adminFound._id, userType: "Admin" },
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

// Verifica si hay una sesión de admin activa (usado por el frontend para proteger rutas)
loginAdminController.checkSession = async (req, res) => {
  try {
    const token = req.cookies.authCookie;

    if (!token) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (decoded.userType !== "Admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const adminFound = await adminModel.findById(decoded.id).select("-password");

    if (!adminFound) {
      return res.status(401).json({ message: "No autenticado" });
    }

    return res.status(200).json({
      message: "Sesión activa",
      admin: { email: adminFound.email, name: adminFound.name },
    });
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default loginAdminController; 