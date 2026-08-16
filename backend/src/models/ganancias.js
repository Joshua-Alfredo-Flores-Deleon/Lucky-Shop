//importamos mongoose, Schema y model
import mongoose, {Schema, model} from "mongoose"

//Esquema para el registro y cálculo de Ganancias mensuales
const ganancias = new Schema({
    ventas: [{ //Arreglo de ventas realizadas en el mes
        idVenta: {  //Referencia a la venta específica
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ventas",
        },
    }],
    gastos: [{ //Arreglo de gastos realizados en el mes
        idGasto: {  //Referencia al gasto específico
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gastos",
        },
    }],
    fechaMes:{ //Mes al que corresponde el registro
        type: Date
    },
    totalGanancias:{ //Cálculo total (ventas - gastos)
        type:Number
    }
}, {
    timestamps: true, //Agrega createdAt y updatedAt automáticamente
    strict: false //Permite guardar campos que no estén definidos en el esquema
})

//Exportamos el modelo con el nombre de la colección "Ganancias"
export default model("Ganancias", ganancias)

