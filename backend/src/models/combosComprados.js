/*
    idCombo 
    idCliente
    urlVideo
    status
*/

//importamos mongoose, Schema y model
import mongoose, {Schema, model} from "mongoose"

//Esquema para los Combos Comprados por los clientes
const combosComprados = new Schema({
    idCombo: { //Referencia al combo comprado
      type: mongoose.Schema.Types.ObjectId,
      ref: "ComboSuerte",
    },
    idCliente: { //Referencia al cliente que realizó la compra
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
    },
    urlVideo : { type: String }, //URL del video de confirmación/apertura
    public_id:{type:String}, //ID público del video en Cloudinary
    status: { type: Boolean }, //Estado de la compra (completado, pendiente)
}, {
    timestamps: true, //Agrega createdAt y updatedAt automáticamente
    strict: false //Permite guardar campos que no estén definidos en el esquema
})

//Exportamos el modelo con el nombre de la colección "combosComprados"
export default model("combosComprados", combosComprados, "combosComprados")