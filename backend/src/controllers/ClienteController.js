import clientsModel from "../models/Clientes.js"
import bcrypt from "bcryptjs"


//array de funciones
const clientesController = {};

clientesController.getAllClients = async (req, res) =>{
    try{
        const clients = await clientsModel.find();
        return res.status(200).json(clients);
    }catch(error){
        console.log("error" + error);
        return res.status(500).json({message: "Internal sever error"})
    }
};


//UPDATE
clientesController.updateClients = async (req, res)=>{
    try{
        let{
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttemps,
            timeOut,
        } = req.body

        //validaciones
        name = name?.trim()
        email = email?.trim()

        //valores requeridos
        if(!name || !email || !password){
            return res.status(400).json({message:"Fields required"})
        }

        //validaciones de fechas
        if(birthdate > new Date|| birthdate < new Date ("1901-01-01")){
            return res.status(400).json({message: "invalid date"})
        }

        // Si el password que llega no es ya un hash de bcrypt (por ejemplo,
        // el admin escribio una contraseña nueva en texto plano), lo encriptamos.
        // Si viene sin cambios (el hash que ya estaba guardado), lo dejamos igual
        // para no romper el login del cliente.
        const isBcryptHash = /^\$2[aby]?\$\d{2}\$/.test(password)
        if (!isBcryptHash) {
            password = await bcrypt.hash(password, 10)
        }

        const clientUpdated = await clientsModel.findByIdAndUpdate(
            req.params.id,
            {
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttemps,
            timeOut,
            },
            {new : true },
        );

        if(!clientUpdated){
            return res.status(400).json({message: "client not found"})
        }
            return res.status(200).json({message: "client updated"})

    }catch(error)   {
        console.log("error" + error);
        return res.status(500).json({message: "internal server error"});
    }
};

//ELIMINAR
clientesController.deleteClient = async (req, res) => {
  try{
   const deleteClient = await clientsModel.findByIdAndDelete(req.params.id);

   //si no se elimina es ´porque no encontro el id
   if(!deleteClient){
    return res.status(404).json({message: "Client not found"});
   }
   return res.status(200).json({message: "Client deleted"});
  }catch(error){
     console.log("error" + error);
     return res.status(500).json({message: "Internal server error"});
  }
};

export default clientesController;