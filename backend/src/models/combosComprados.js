/*
    idCombo 
    idCliente
    urlVideo
    status
*/

import mongoose, {Schema, model} from "mongoose"

const combosComprados = new Schema({
    idCombo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ComboSuerte",
    },
    idCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
    },
    urlVideo : { type: String },
    public_id:{type:String},
    status: { type: Boolean },
}, {
    timestamps: true,
    strict: false
})

export default model("combosComprados", combosComprados, "combosComprados")