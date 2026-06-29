//Creo un array de funciones
const comboSuerteController = {};
//importo la colección que voy a utilizar
import comboSuerteModel from "../models/comboSuerte.js";


//SELECT 
comboSuerteController.getComboSuerte = async (req, res) => {
    try {
        const ComboSuerte = await comboSuerteModel.find()
        return res.status(200).json(ComboSuerte)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//INSERT
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

//ELIMINAR
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

export default comboSuerteController;