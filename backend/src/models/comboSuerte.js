/*
    comboSuerte {
        idBolsa
    }
*/

import {Schema, model} from "mongoose"

const comboSuerte = new Schema({
    bolsas: [{
        idBolsa: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bolsas",
        },
    }]
}, {
    timestamps: true,
    strict: false
})

export default model("comboSuerte", comboSuerte)