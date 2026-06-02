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

export default loginClientesController;