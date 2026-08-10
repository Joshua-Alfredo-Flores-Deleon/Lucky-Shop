import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../../config.js";

//Configuramos cloudinary con nuestras credenciales de las variables de entorno
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
})

//Configurar cómo y dónde guardar los archivos multimedia en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "LuckyShop", // Carpeta de destino en el servicio Cloudinary
        resource_type: "auto", // Detectar automáticamente el tipo de archivo (imagen, video, etc.)
        allowed_formats: ["jpg", "png", "jpeg", "gif", "mp3", "mp4", "mp5", "mov", "avi", "mkv"] // Formatos permitidos
    }
})

//Configurar middleware multer utilizando el almacenamiento en la nube
const upload = multer({storage})

//Exportamos el middleware upload para usarlo en rutas que procesen subida de archivos
export default upload