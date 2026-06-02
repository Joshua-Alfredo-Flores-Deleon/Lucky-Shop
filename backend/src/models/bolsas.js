/*
    bolsas {
        idProducto
    }
*/

import mongoose, {Schema, model} from "mongoose"

const Bolsas = new Schema({
    bolsas: [{
        idProducto: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: "Productos",
        },
    }]
}, {
    timestamps: true,
    strict: false
})

export default model("Bolsas", Bolsas)