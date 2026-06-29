/*
    comboSuerte {
        idBolsa
    }
*/

import mongoose, {Schema, model} from "mongoose"

const ComboSuerte = new Schema({
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

export default model("ComboSuerte", ComboSuerte, "ComboSuerte")