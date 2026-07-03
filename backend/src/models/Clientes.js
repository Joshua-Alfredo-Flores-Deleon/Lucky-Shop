import { Schema, model } from "mongoose";

const clienteSchema = new Schema(
  {
    name: { type: String },
    lastName:{type:String},
    birthdate: { type: Date },
    email : { type: String },
    gender: { type: String },
    phone: { type: String },
    profileImage: { type: String },
    profileImagePublicId: { type: String },
    favoritos: [{ type: Schema.Types.ObjectId, ref: "products" }],
    public_id:{type: String},
    password: { type: String },
    isVerified: { type: Boolean },
    loginAttemps: { type: Number },
    timeOut: { type: Date },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Clientes", clienteSchema);