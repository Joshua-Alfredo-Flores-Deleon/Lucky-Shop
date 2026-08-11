//Controlador para manejar el cierre de sesión
const logoutController = {};

//POST - Cerrar sesión limpiando la cookie de autenticación
logoutController.logout = async (req, res) => {
  res.clearCookie("authCookie");

  return res.status(200).json({ message: "Sesión cerrada" });
};

//Exportamos el controlador para usarlo en las rutas
export default logoutController;