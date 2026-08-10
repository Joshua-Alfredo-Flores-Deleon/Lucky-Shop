//Creo un array de funciones
const comboSuerteController = {};
//importo la colección que voy a utilizar
import comboSuerteModel from "../models/comboSuerte.js";


//GET - Obtener todos los combos de suerte con los datos de sus bolsas
comboSuerteController.getComboSuerte = async (req, res) => {
    try {
        const ComboSuerte = await comboSuerteModel.find().populate("bolsas.idBolsa")
        return res.status(200).json(ComboSuerte)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//GET - Obtener un combo de suerte por su ID
comboSuerteController.getComboSuerteById = async (req, res) => {
    try {
        const combo = await comboSuerteModel.findById(req.params.id).populate("bolsas.idBolsa")

        if (!combo) {
            return res.status(404).json({ message: "ComboSuerte not found" })
        }

        return res.status(200).json(combo)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//POST - Insertar un nuevo combo de suerte
comboSuerteController.insertComboSuerte = async (req, res) => {
    try {

        const { bolsas } = req.body;

        const newComboSuerte = new comboSuerteModel({
            bolsas
        })

        await newComboSuerte.save()

        return res.status(200).json({message: "ComboSuerte Saved"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//PUT - Actualizar un combo de suerte existente por su ID
comboSuerteController.updateComboSuerte = async (req, res) => {
    try {
        const { bolsas } = req.body;

        const comboActualizado = await comboSuerteModel.findByIdAndUpdate(
            req.params.id,
            { bolsas },
            { new: true }
        ).populate("bolsas.idBolsa")

        if (!comboActualizado) {
            return res.status(404).json({ message: "ComboSuerte not found" })
        }

        return res.status(200).json(comboActualizado)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//DELETE - Eliminar un combo de suerte por su ID
comboSuerteController.deleteComboSuerte = async (req, res) => {
    try {
    const ComboSuerteDeleted = await comboSuerteModel.findByIdAndDelete(req.params.id)

        if(!ComboSuerteDeleted){
            return res.status(404).json({message: "ComboSuerte not found"})
        }

        return res.status(200).json({message: "ComboSuerte deleted"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//Exportamos el controlador para usarlo en las rutas
export default comboSuerteController;
