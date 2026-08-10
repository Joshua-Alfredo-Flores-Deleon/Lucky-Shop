//Importamos el dotenv
import dotenv from "dotenv";

// Ejecutamos la libreria dotenv para cargar las variables del archivo .env
dotenv.config();

export const config = {
  // Configuración de la base de datos MongoDB
  db: {
    URI: process.env.DB_URI,
  },
  // Configuración del secreto para JsonWebToken
  JWT: {
    secret: process.env.JWT_secret_key,
  },
  // Credenciales para envío de correos
  email:{
    user_email: process.env.USER_EMAIL,
    user_password: process.env.USER_PASSWORD
  },
  // Credenciales de la API de Cloudinary para manejo de imágenes
  cloudinary: {
    cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
  },
  // Credenciales para la pasarela de pagos Wompi
  wompi:{
    grant_type: process.env.GRANT_TYPE,
    audience: process.env.AUDIENCE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  }
};