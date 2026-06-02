//Creo un array de funciones
const bolsasController = {};
//importo la colección que voy a utilizar
import bolsasModel from "../models/bolsas.js";


//SELECT 
bolsasController.getBolsas = async (req, res) => {
    try {
        const bolsas = await bolsasModel.find()
        return res.status(200).json(bolsas)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//INSERT
bolsasController.insertBolsas = async (req, res) => {
    try {
        
        const { bolsas } = req.body;

        const newBolsas = new bolsasModel({
            bolsas
        })

        await newBolsas.save()

        return res.status(200).json({message: "bolsas Saved"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//ELIMINAR
bolsasController.deleteBolsas = async (req, res) => {
    try {
    const bolsasDeleted = await bolsasModel.findByIdAndDelete(req.params.id)

        if(!bolsasDeleted){
            return res.status(404).json({message: "Bolsas not found"})
        }

        return res.status(200).json({message: "Bolsas deleted"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default bolsasController;