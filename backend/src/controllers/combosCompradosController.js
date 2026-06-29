import combosCompradosModel from "../models/combosComprados.js";

import {v2 as cloudinary} from "cloudinary"

//Array de funciones
const combosCompradosController = {}

//SELECT 
combosCompradosController.getAllcombosComprados = async (req, res) => {
    try {
        const combosComprados = await combosCompradosModel.find()
        return res.status(200).json(combosComprados)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//INSERT
combosCompradosController.insertcombosComprados = async (req, res) => {
    try {
        
        const { idCombo,
                idCliente,
                status
            } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        const newComboComprados = new combosCompradosModel({
            idCombo,
            idCliente,
            urlVideo: req.file.path,
            public_id: req.file.filename,
            status
        })

        await newComboComprados.save()

        return res.status(200).json({message: "ComboComprados Saved"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//ELIMINAR
combosCompradosController.deletecombosComprados = async (req, res) => {
    try {
        const ComboCompradosFound = await combosCompradosModel.findById(req.params.id)

        if (!ComboCompradosFound) {
            return res.status(404).json({ message: "ComboComprados not found" })
        }

        await cloudinary.uploader.destroy(ComboCompradosFound.public_id)

        await combosCompradosModel.findByIdAndDelete(req.params.id)

        return res.status(200).json({message: "ComboComprados deleted"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//UPDATE
combosCompradosController.updatecombosComprados = async (req, res) => {
    try {
        
        const {idCombo, idCliente, status} = req.body;

        const ComboCompradosFound = await combosCompradosModel.findById(req.params.id)

        if (!ComboCompradosFound) {
            return res.status(404).json({ message: "ComboComprados not found" })
        }

        const updatedData = {
            idCombo, idCliente, status
        }

        if(req.file){
            await cloudinary.uploader.destroy(ComboCompradosFound.public_id)

            updatedData.urlVideo = req.file.path
            updatedData.public_id = req.file.filename
        }

        await combosCompradosModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new:true}
        )

        return res.status(200).json({message:"ComboComprados Updated"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default combosCompradosController;