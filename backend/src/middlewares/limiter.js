import rateLimit from "express-rate-limit"

// Configuración del middleware de límite de peticiones (Rate Limiting)
const limiter = rateLimit({
    windowMs: 5 * 60 *1000, // Tiempo de espera: 5 minutos
    max: 100, // Máximo de 100 solicitudes HTTP por IP permitidas en ese tiempo
    message: {
        status: 429,
        error: "Too many Request" // Mensaje devuelto cuando se excede el límite
    }
})

// Exportamos el middleware para usarlo globalmente o en rutas específicas
export default limiter