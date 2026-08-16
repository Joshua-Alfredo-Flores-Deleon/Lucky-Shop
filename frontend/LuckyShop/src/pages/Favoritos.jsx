//Pagina de Favritos - Donde se encuentran los productos favoritos de los clientes
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CategoryBanner from '../components/CategoryBanner.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = import.meta.env.VITE_API_URL + ''

// Ícono de corazón usado junto al título "Favoritos"
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900 inline-block mr-2 -mt-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
)

const Favoritos = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [favoritos, setFavoritos] = useState([])       // Lista de productos marcados como favoritos
  const [cargando, setCargando] = useState(true)
  const [filtroActivo, setFiltroActivo] = useState('Todos') // Categoría seleccionada para filtrar
  const [orden, setOrden] = useState('reciente')        // Orden de la lista: reciente o antiguo

  // Si no hay sesión activa, redirige a login. Si la hay, carga los favoritos del cliente.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    const cargarFavoritos = async () => {
      try {
        const res = await fetch(`${BASE_URL}/perfilCliente/favoritos`, { credentials: 'include' })
        const data = await res.json()
        if (res.ok) {
          // Aseguramos que tengan la propiedad esFavorito = true para el ProductCard
          const favs = data.map(p => ({ ...p, esFavorito: true }))
          setFavoritos(favs)
        }
      } catch (error) {
        console.error('Error al cargar favoritos:', error)
      } finally {
        setCargando(false)
      }
    }
    
    cargarFavoritos()
  }, [isAuthenticated, navigate])

  // Categorías disponibles para filtrar los favoritos, junto con el valor
  // que se compara contra "idCategoria" de cada producto
  const categorias = [
    { id: 'Todos', label: 'Todos', match: 'Todos' },
    { id: 'Anillos', label: 'Anillos', match: 'Anillos' },
    { id: 'Aretes', label: 'Pendientes', match: 'Aretes' },
    { id: 'Collares', label: 'Collares', match: 'Collares' },
    { id: 'Pulseras', label: 'Pulseras', match: 'Pulseras' }
  ]

  // Cuenta cuántos favoritos hay por cada categoría, para mostrar el número junto al filtro
  const conteos = categorias.reduce((acc, cat) => {
    if (cat.id === 'Todos') {
      acc[cat.id] = favoritos.length
    } else {
      acc[cat.id] = favoritos.filter(p => p.idCategoria && p.idCategoria.toLowerCase() === cat.match.toLowerCase()).length
    }
    return acc
  }, {})

  // Aplica el filtro de categoría seleccionado a la lista de favoritos
  let favoritosMostrados = favoritos
  if (filtroActivo !== 'Todos') {
    const catSelec = categorias.find(c => c.id === filtroActivo)
    if(catSelec) {
       favoritosMostrados = favoritos.filter(p => p.idCategoria && p.idCategoria.toLowerCase() === catSelec.match.toLowerCase())
    }
  }

  // Aplica el orden seleccionado (más reciente primero, o invertido para más antiguo)
  if (orden === 'reciente') {
    // El backend suele devolver el más reciente al final o al inicio, lo dejamos default
  } else if (orden === 'antiguo') {
    favoritosMostrados = [...favoritosMostrados].reverse()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Banner superior con el título "Favoritos" y su ícono de corazón */}
      <CategoryBanner 
        titulo={
          <div className="flex items-center capitalize lowercase">
            <HeartIcon /> Favoritos
          </div>
        }
        descripcion="Encuentra aquí todos los productos que has marcado como favorito"
      />

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        
        {cargando ? (
          // Estado de carga
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        ) : favoritos.length === 0 ? (
          // Sin favoritos guardados todavía
          <div className="text-center py-20 text-gray-500">
            Aún no tienes productos favoritos. Ve al catálogo y toca el ♡ en cualquier producto para guardarlo aquí.
          </div>
        ) : (
          <>
            {/* Barra de filtros por categoría y selector de orden */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-200 pb-4">
              
              {/* Botones de filtro por categoría, cada uno con su conteo */}
              <div className="flex flex-wrap gap-6 md:gap-10 text-sm">
                {categorias.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setFiltroActivo(cat.id)}
                    className={`pb-1 relative ${filtroActivo === cat.id ? 'font-semibold text-black' : 'text-gray-500 hover:text-black'}`}
                  >
                    {cat.label}({conteos[cat.id] || 0})
                    {/* Línea inferior que resalta la categoría activa */}
                    {filtroActivo === cat.id && (
                      <div className="absolute left-0 right-0 -bottom-4 h-[2px] bg-black"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Selector de orden: más reciente o más antiguo */}
              <div className="flex items-center gap-2 text-sm mt-4 md:mt-0">
                <span className="text-gray-600 font-medium">Ordenar por:</span>
                <select 
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="bg-gray-200/60 px-4 py-1.5 rounded text-sm font-semibold focus:ring-0 cursor-pointer border-0 outline-none text-gray-800"
                >
                  <option value="reciente">Más reciente</option>
                  <option value="antiguo">Más antiguo</option>
                </select>
              </div>

            </div>

            {/* Grilla de productos favoritos (ya filtrados y ordenados) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {favoritosMostrados.map(p => (
                <ProductCard key={p._id} producto={p} />
              ))}
            </div>
            
            {/* Si el filtro de categoría no tiene resultados */}
            {favoritosMostrados.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                No tienes favoritos en esta categoría.
              </div>
            )}
          </>
        )}

      </div>
      
      <Footer />
    </div>
  )
}

export default Favoritos;