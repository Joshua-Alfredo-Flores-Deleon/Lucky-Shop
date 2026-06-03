//Creo un array de funciones
const carritoController = {};
//importo la colección que voy a utilizar
import carritoModel from "../models/carrito.js";


//SELECT 
carritoController.getCarrito = async (req, res) => {
    try {
        const carrito = await carritoModel.find()
        return res.status(200).json(carrito)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//INSERT
carritoController.insertCarrito = async (req, res) => {
    try {
        
        const { carrito } = req.body;

        const newCarrito = new carritoModel({
            carrito
        })

        await newCarrito.save()

        return res.status(200).json({message: "carrito Saved"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//ELIMINAR
carritoController.deleteCarrito = async (req, res) => {
    try {
    const carritoDeleted = await carritoModel.findByIdAndDelete(req.params.id)

        if(!carritoDeleted){
            return res.status(404).json({message: "Carrito not found"})
        }

        return res.status(200).json({message: "Carrito deleted"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default carritoController;