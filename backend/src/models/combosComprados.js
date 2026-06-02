/*
    idCombo 
    idCliente
    urlVideo
    status
*/

import {Schema, model} from "mongoose"

const comboComprados = new Schema({
    idCombo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comboSuerte",
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

export default model("comboComprados", comboComprados)