// Home.jsx — dashboard principal del admin de Lucky Shop
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'

const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('luckyshop_token') || sessionStorage.getItem('luckyshop_token')
  const user  = localStorage.getItem('luckyshop_user')  || sessionStorage.getItem('luckyshop_user') || ''

  const [stats, setStats] = useState({ total: 0, activos: 0, agotados: 0, inactivos: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!token) { navigate('/'); return }

    // Carga estadísticas de productos
    const fetchStats = async () => {
      try {
        const res  = await fetch('http://localhost:4000/api/productos', { credentials: 'include' })
        const data = await res.json()
        setStats({
          total:    data.length,
          activos:  data.filter((p) => p.estado === 'activo').length,
          agotados: data.filter((p) => p.estado === 'agotado').length,
          inactivos:data.filter((p) => p.estado === 'inactivo').length,
        })
      } catch {
        // Si el backend no está disponible, solo muestra ceros
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [navigate, token])

  const statCards = [
    { label: 'Total productos', value: stats.total,    color: 'bg-pink-500',   icon: '' },
    { label: 'Activos',         value: stats.activos,   color: 'bg-emerald-500',icon: '' },
    { label: 'Agotados',        value: stats.agotados,  color: 'bg-amber-500',  icon: '' },
    { label: 'Inactivos',       value: stats.inactivos, color: 'bg-gray-400',   icon: '' },
  ]

  return (
    <div className="min-h-screen bg-pink-50">
      {token && <Nav />}

      <main className="container mx-auto px-6 py-10">
        {/* Bienvenida */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenida{user ? `, ${user}` : ''} 
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Resumen del sistema Lucky Shop</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-3xl shadow-sm ring-1 ring-pink-100 p-5">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl ${card.color} mb-3`}>
                <span className="text-lg">{card.icon}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {loadingStats ? '—' : card.value}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Acceso rápido */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Acceso rápido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <button
              onClick={() => navigate('/productos')}
              className="flex items-center gap-4 bg-white rounded-3xl shadow-sm ring-1 ring-pink-100 p-5 hover:bg-pink-50 transition-colors text-left"
            >
              <span className="text-3xl"></span>
              <div>
                <p className="font-semibold text-gray-900">Productos</p>
                <p className="text-xs text-gray-400 mt-0.5">Ver y gestionar el catálogo</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
