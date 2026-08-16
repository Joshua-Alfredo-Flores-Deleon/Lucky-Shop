//Controlador para la integración de pagos con Wompi
import fetch from "node-fetch";
import {config} from "../../config.js";

//array de funciones
const wompiController = {};

//POST - Generar un token de autenticación con la API de Wompi
wompiController.generaToken = async (req, res) => {
   try {
        // Hacemos una petición POST al endpoint de autenticación de Wompi
        const response = await fetch("https://id.wompi.sv/connect/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            // Enviamos las credenciales almacenadas en las variables de entorno
            body: new URLSearchParams({
                grant_type: config.wompi.grant_type,
                audience: config.wompi.audience,
                client_id: config.wompi.client_id,
                client_secret: config.wompi.client_secret,
            })
        })

        // Verificamos si la respuesta falló
        if(!response){
            const error = await response.text({error})
            return res.status(500).json({error})
        }

        // Extraemos los datos (incluyendo el token) y los devolvemos al frontend
        const data = await response.json();
        return res.status(200).json(data)

    } catch (error) {
       console.log("error" +error)
       return res.status(500).json({message: "interna server error"})
    }
};

//POST - Realizar una transacción de prueba sin 3D Secure
wompiController.paymentTest = async (req, res) => {
    try {
        // Extraemos el token generado y los datos del formulario de pago
        const {token, formData} = req.body;

        // Enviamos la petición de compra tokenizada a Wompi (entorno de pruebas)
        const response = await fetch(
            "https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Pasamos el token en los headers
                },
                body: JSON.stringify(formData) // Datos de la tarjeta y monto
            }
        )

        // Manejamos posible error de red
        if(!response){
            const error = await response.text({error})
            return res.status(500).json({error})
        }

        // Devolvemos la respuesta de Wompi (aprobado o rechazado)
        const data = await response.json()
        return res.status(200).json(data)
    } catch (error) {
        console.log("error" +error)
        return res.status(500).json({message: "interna server error"})
    }
};

//POST - Realizar una transacción real con 3D Secure
wompiController.payment3DS = async (req, res) => {
    try {
        // Extraemos el token y los datos del formulario
        const {token, formData} = req.body;

        // Hacemos la petición a la pasarela con protocolo 3D Secure (entorno real)
        const response = await fetch(
            "https://api.wompi.sv/TransaccionCompra/3Ds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Token de autenticación
                },
                body: JSON.stringify(formData) // Incluye datos de tarjeta, cliente y monto
            }
        )

        // Verificamos si hubo un problema de conexión
        if(!response){
            const error = await response.text({error})
            return res.status(500).json({error})
        }

        // Devolvemos el resultado de la transacción
        const data = await response.json()
        return res.status(200).json(data) 
    } catch (error) {
        console.log("error" +error)
        return res.status(500).json({message: "interna server error"})
    }
}

//Exportamos el controlador para usarlo en las rutas
export default wompiController;