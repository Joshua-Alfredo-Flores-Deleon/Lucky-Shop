import {Schema, model} from "mongoose"

const ganancias = new Schema({
    ventas: [{
        idVenta: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ventas",
        },
    }],
    gastos: [{
        idGasto: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gastos",
        },
    }],
    fechaMes:{
        type: Date
    },
    totalGanancias:{
        type:Number
    }
}, {
    timestamps: true,
    strict: false
})

export default model("Ganancias", ganancias)

