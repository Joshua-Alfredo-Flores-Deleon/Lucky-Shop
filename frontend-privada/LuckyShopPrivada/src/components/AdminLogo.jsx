// AdminLogo.jsx — logo reutilizable "Luckyshop by Leslie" para las pantallas
// de autenticación del panel admin (login + recuperación de contraseña).
const AdminLogo = ({ size = 'lg', className = '' }) => {
  // Configuración de tamaños para el texto principal
  const sizes = {
    lg: 'text-4xl',
    md: 'text-3xl',
  }

  return (
    // Contenedor principal con texto centrado
    <div className={`text-center ${className}`}>
      {/* Logo principal con colores estilizados */}
      <h1 className={`${sizes[size]} font-bold tracking-tight leading-none`}>
        <span className="text-pink-500">Lucky</span>
        <span className="text-green-600">sh</span>
        {/* Icono de trébol como letra 'o' */}
        <span className="text-green-500" aria-hidden="true">☘</span>
        <span className="text-green-600">p</span>
      </h1>
      {/* Subtítulo del logo */}
      <p className="text-gray-400 text-[10px] tracking-[0.2em] font-medium mt-0.5">BY LESLIE</p>
    </div>
  )
}

export default AdminLogo;