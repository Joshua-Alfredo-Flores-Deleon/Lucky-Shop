import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";

// Middleware genérico: valida que exista una cookie authCookie con un JWT válido.
// Si se le pasa un userType ("Admin" | "Clientes"), además exige que coincida.
export const validateAuthToken = (userType) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.authCookie;

      if (!token) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const decoded = jsonwebtoken.verify(token, config.JWT.secret);

      if (userType && decoded.userType !== userType) {
        return res.status(403).json({ message: "No autorizado" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};

export default validateAuthToken;
