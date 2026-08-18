// 404.jsx — Página 404 del sitio público de Lucky Shop.
// Se muestra cuando el usuario intenta acceder a una ruta que no existe.
// Ofrece un botón para volver al inicio, manteniendo la navegabilidad.
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0000] px-6 text-center">
      {/* Trébol de la marca (imagen servida desde /public) */}
      <img
        src="/favicon-negro.png"
        alt="LuckyShop"
        className="w-20 h-20 object-contain mb-6"
      />

      {/* Número grande 404 */}
      <p className="text-[110px] leading-none font-extrabold text-black-700 drop-shadow-sm">
        404
      </p>

      {/* Mensaje */}
      <h2 className="text-2xl font-bold text-gray-800 mt-2">
        Página no encontrada
      </h2>
      <p className="text-gray-600 mt-3 max-w-md">
        La página que buscas no existe o fue movida. Puede que el enlace esté roto
        o que hayas escrito mal la dirección.
      </p>

      {/* Botón para volver al inicio */}
      <Link
        to="/home"
        className="mt-8 inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-full"
      >
        Volver al inicio
      </Link>

    </div>
  )
}

export default NotFound;