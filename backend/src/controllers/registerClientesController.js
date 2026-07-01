import nodemailer from "nodemailer"; //Enviar correo
import crypto from "crypto"; //Generar codigo aleatorio
import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; //Encriptar
import clientsModel from "../models/Clientes.js";
import {config} from "../../config.js";
 
//array de funciones
const registerClientsController = {};
 
registerClientsController.register = async (req, res) => {
  //#1- Solicitar los datos
  const {
    name,
    lastName,
    birthdate,
    password,
    isVerified
  } = req.body;

  // Normalizamos el correo (sin espacios y en minusculas) para que
  // siempre coincida al buscarlo despues, sin importar como lo haya escrito el usuario
  const email = req.body.email?.trim().toLowerCase();
 
  try {
 
    //Validar que el correo no exista en la base de datos
    const existsClient = await  clientsModel.findOne({email});
    if (existsClient){
      return res.status(400).json({message: "Client already exist"})
    }
 
    //  Encriptar la contraseña
    const passwordHased = await bcryptjs.hash(password, 10)
 
    //Generar un codigo aleatorio
    const randomNumber = crypto.randomBytes(3).toString("hex")
 
    //Guardamos en un token la informacion
    const token = jsonwebtoken.sign(
      //#1- ¿Que vamos a guardar?
      {randomNumber,
      name,
      lastName,
      birthdate,
      email,
      password: passwordHased,
      isVerified
    },
 
      //#2-Secret key
        config.JWT.secret,
      //#3-Cuando expira
      {expiresIn:"15m"}
    );
 
    res.cookie("RegistrarionClientCookie", token, {maxAge: 15 * 60 * 1000})
 
    //Enviamos el codigo aleatorio por correo electronico
    //1#- Creamso el transporter -> ¿Quien envia el correo?
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
        user: config.email.user_email,
        pass: config.email.user_password
      }
    })
 
    //#2- MailOption -> ¿?Quine lo recibe y como
      const mailOptions ={
        from: config .email.user_email,
        to: email,
        subject: "Verificacion de cuenta",
        text: "Para verificar tu cuenta, utiliza este codigo: " + randomNumber + " Expira en 15 minutos"
      }
 
    //#3- Enviar el correo
    transporter.sendMail(mailOptions, (error, info)=>{
      if(error){
        console.log("error"+error)
        return res.status(500).json({message:"Error sending email"})
      }
      return res.status(200).json({message:"Email sent"})
    })
  } catch (error) {
    console.log("error"+error)
    return res.status(500).json({message: "Internal server error"})
  }
 
};
 
//Verificar el codigo que acabamos de enviar
 
registerClientsController.verifyCode = async (req, res) => {
  try {
    //Solicitamos el codigo que escribieron en el frontend
    const {verificationCodeRequest} = req.body
 
    //Obtener el token de las cookies
    const token = req.cookies.RegistrarionClientCookie
   
    //Extrar toda la informacion del token
    const decoced = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomNumber: storedCode,
      name,
      lastName,
      birthdate,
      email,
      password,
      isVerified,
    } = decoced;
 
    //Comparar lo que el usuario escribio con el codigo esta en el token
    if(verificationCodeRequest !== storedCode){
      return res.status(400).json({message: "Invalid code"})
    }
 
    //Si todo esta bien y el usuario escribe el codigo lo registramos en la base de datos
    const NewClient = new clientsModel({
      name,
      lastName,
      birthdate,
      email,
      password,
      isVerified: true,
    });
 
    await NewClient.save();
 
    res.clearCookie("RegistrarionClientCookie")
 
    return res.status(200).json({message: "Client register"})
 
  } catch (error) {
    console.log("error"+error)
    return res.status(500).json({message: "Internal server error"});
  }
};
 
export default registerClientsController;