// Categoria.jsx — listado de productos por categoría con subcategorías
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CategoryBanner from '../components/CategoryBanner.jsx'

const BASE_URL = 'http://localhost:4000/api'

const CONFIG_CATEGORIAS = {
  anillos: {
    titulo: 'Anillos',
    descripcion: 'Encuentra tu anillo que "nunca me quito" en nuestra selección de anillos, anillos de compromiso, anillos formativos y más. Tu próxima colección de anillos favoritos comienza aquí.',
    subcategorias: [
      { value: 'compromiso', label: 'Anillos de Compromiso', icon: '' },
      { value: 'promesa',    label: 'Anillos Promesa',       icon: '' },
      { value: 'alianza',    label: 'Anillos Alianza',       icon: '' },
      { value: 'eternidad',  label: 'Anillos Eternidad',     icon: '' },
    ],
  },
  pulseras: {
    titulo: 'Pulseras',
    descripcion: 'No es solo una joya, es un recordatorio tangible de que la suerte no ocurre por azar, sino porque llevas contigo la energía necesaria para atraerla; deja que esta pulsera sea el amuleto que sintonice tu destino con tus deseos.',
    subcategorias: [
      { value: 'rigida',   label: 'Brazaletes Rígidos',   icon: '' },
      { value: 'cuentas',  label: 'Pulseras de Cuentas',  icon: '' },
      { value: 'charm',    label: 'Charms',               icon: '' },
      { value: 'cadena',   label: 'Pulseras de Cadena',   icon: '' },
    ],
  },
  pendientes: {
    titulo: 'Pendientes',
    descripcion: 'La distinción no es una coincidencia, es una elección. Estos pendientes han sido grabados con la firme convicción de que la elegancia es el imán definitivo de la fortuna.',
    subcategorias: [
      { value: 'aro',       label: 'Pendientes de Aro',     icon: '' },
      { value: 'colgante',  label: 'Pendientes Colgantes',  icon: '' },
      { value: 'piercing',  label: 'Piercings',             icon: '' },
    ],
  },
  collares: {
    titulo: 'Collares',
    descripcion: 'El destino se rinde ante quienes caminan con seguridad; deja que este collar sea el destello que ilumine tu camino y atraiga hacia ti las sincronías perfectas que el universo tiene preparadas para quienes se atreven a brillar.',
    subcategorias: [
      { value: 'choker',    label: 'Collares Choker',    icon: '' },
      { value: 'princesa',  label: 'Collares Princesas', icon: '' },
      { value: 'matine',    label: 'Collares Matine',    icon: '' },
      { value: 'opera',     label: 'Collares Opera',     icon: '' },
      { value: 'cuerda',    label: 'Collares Cuerda',    icon: '' },
    ],
  },
  otros: {
    titulo: 'Otros',
    descripcion: 'Accesorios únicos y especiales para completar tu look.',
    subcategorias: [],
  },
}

const Categoria = () => {
  const { cat } = useParams()
  const config = CONFIG_CATEGORIAS[cat] || { titulo: cat, descripcion: '', subcategorias: [] }

  const [productos,    setProductos]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [subcatActiva, setSubcatActiva] = useState('')

  useEffect(() => {
    setLoading(true)
    setSubcatActiva('')
    const fetchProductos = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/productos?categoria=${cat}&estado=activo`, { credentials: 'include' })
        const data = await res.json()
        setProductos(Array.isArray(data) ? data : [])
      } catch {
        setProductos([])
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [cat])

  const productosFiltrados = subcatActiva
    ? productos.filter((p) => p.subCategoria?.toLowerCase() === subcatActiva)
    : productos

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Banner de categoría */}
      <CategoryBanner
        titulo={config.titulo}
        descripcion={config.descripcion}
        subcategorias={config.subcategorias}
        subcatActiva={subcatActiva}
        onSubcat={setSubcatActiva}
      />

      {/* Productos */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3"></p>
            <p>No hay productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {productosFiltrados.map((p) => (
              <ProductCard key={p._id} producto={p} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Categoria
