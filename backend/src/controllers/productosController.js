//Creo un array de funciones
const productosController = {};
//importo la colección que voy a utilizar
import productsModel from "../models/Productos.js";


//SELECT 
productosController.getProductos = async (req, res) => {
    try {
        const productos = await productsModel.find()
        return res.status(200).json(productos)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//INSERT
productosController.insertProductos = async (req, res) => {
    try {
        
        const { productos } = req.body;

        const newProductos = new productosModel({
            productos
        })

        await newProductos.save()

        return res.status(200).json({message: "productos Saved"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//ELIMINAR
productosController.deleteProductos = async (req, res) => {
    try {
    const productosDeleted = await productosModel.findByIdAndDelete(req.params.id)

        if(!productosDeleted){
            return res.status(404).json({message: "Productos not found"})
        }

        return res.status(200).json({message: "Productos deleted"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default productosController;