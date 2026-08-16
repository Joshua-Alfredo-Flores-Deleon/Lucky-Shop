/*
    comboSuerte {
        idBolsa
    }
*/

//importamos mongoose, Schema y model
import mongoose, {Schema, model} from "mongoose"

//Esquema para los Combos de Suerte (agrupación de bolsas)
const ComboSuerte = new Schema({
    bolsas: [{ //Arreglo con las bolsas que componen el combo
        idBolsa: { //Referencia a la bolsa específica
            type: mongoose.Schema.Types.ObjectId,
            ref: "bolsas",
        },
    }]
}, {
    timestamps: true, //Agrega createdAt y updatedAt automáticamente
    strict: false //Permite guardar campos que no estén definidos en el esquema
})

//Exportamos el modelo con el nombre de la colección "ComboSuerte"
export default model("ComboSuerte", ComboSuerte, "ComboSuerte")