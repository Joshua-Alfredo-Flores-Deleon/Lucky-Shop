import rateLimit from "express-rate-limit"

const limiter = rateLimit({
    windowMs: 5 * 60 *1000, //5 minutos
    max: 100, //Maximo de solicitudes HTTP
    message: {
        status: 429,
        error: "Too many Request"
    }
})

export default limiter