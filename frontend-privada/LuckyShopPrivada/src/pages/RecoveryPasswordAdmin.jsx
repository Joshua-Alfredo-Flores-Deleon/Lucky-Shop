// RecoveryPasswordAdmin.jsx — envuelve el componente compartido de recuperación
// de contraseña, indicándole que el flujo es para un administrador (no cliente)
import RecoveryPassword from '../components/RecoveryPassword.jsx'

const RecoveryPasswordAdmin = () => <RecoveryPassword userType="admin" />

export default RecoveryPasswordAdmin;