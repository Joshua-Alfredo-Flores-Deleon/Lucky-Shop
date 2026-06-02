/*
    bolsas {
        idProducto
    }
*/

import mongoose, {Schema, model} from "mongoose"

const bolsas = new Schema({
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

export default model("bolsas", bolsas)