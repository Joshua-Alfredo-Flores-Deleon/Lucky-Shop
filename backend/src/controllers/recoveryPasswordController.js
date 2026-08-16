import jsonwebtoken from "jsonwebtoken"; 
import bcrypt from "bcryptjs"; 
import crypto from "crypto"; 

import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";
import { sendEmail } from "../utils/sendMailMailjet.js"; // nuevo metodo de envio de correos
import { config } from "../../config.js";

// Controlador para manejar la recuperación de contraseña de clientes
import clientesModel from "../models/Clientes.js";

const recoveryPasswordController = {};

//POST - Solicitar un código de recuperación y enviarlo al correo del cliente
recoveryPasswordController.requestCode = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    const userFound = await clientesModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "user not found" });
    }

    const randomCode = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      { email, randomCode, userType: "Clientes", verified: false },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

    // Enviamos el código de recuperación usando Mailjet
    try {
      await sendEmail(
        email,
        "Código de recuperación",
        HTMLRecoveryEmail(randomCode)
      );
    } catch (mailError) {
      console.log("error enviando correo: " + mailError);
      return res.status(500).json({ message: "Error sending email" });
    }

    // Devolvemos el token también en el body para la app móvil (sin cookies).
    return res.status(200).json({ message: "email sent", recoveryToken: token });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//POST - Verificar que el código ingresado sea correcto
recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    // Aceptamos el código y, opcionalmente, el token del body (móvil sin cookies).
    const { code, recoveryToken } = req.body;

    const token = req.cookies.recoveryCookie || recoveryToken;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (code !== decoded.randomCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const newToken = jsonwebtoken.sign(
      { email: decoded.email, userType: "Clientes", verified: true },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

    // Devolvemos el token renovado (verificado) también en el body para móvil.
    return res.status(200).json({ message: "Code verified successfully", recoveryToken: newToken });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//POST - Establecer una nueva contraseña después de verificar el código
recoveryPasswordController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword, recoveryToken } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "password doesnt match" });
    }

    // Token desde la cookie (web) o desde el body (móvil, sin cookies).
    const token = req.cookies.recoveryCookie || recoveryToken;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await clientesModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true },
    );

    res.clearCookie("recoveryCookie");

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Exportamos el controlador para usarlo en las rutas
export default recoveryPasswordController;