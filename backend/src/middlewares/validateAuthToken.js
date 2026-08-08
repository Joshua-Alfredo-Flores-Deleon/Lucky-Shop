import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";

// Middleware genérico: valida que exista una cookie authCookie con un JWT válido.
// Si se le pasa un userType ("Admin" | "Clientes"), además exige que coincida.
export const validateAuthToken = (userType) => {
  return (req, res, next) => {
    try {
      // La app WEB envía el token en la cookie authCookie.
      // La app MÓVIL (React Native) no maneja cookies de forma confiable, por
      // eso también aceptamos el token en el header Authorization: Bearer <token>.
      // Se prioriza la cookie para no cambiar el comportamiento de la web.
      const bearer = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null;
      const token = req.cookies.authCookie || bearer;

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
