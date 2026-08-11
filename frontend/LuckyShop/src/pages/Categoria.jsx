// Categoria.jsx — listado de productos por categoría con subcategorías
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CategoryBanner from '../components/CategoryBanner.jsx'
import { useCategoria } from '../hooks/useCategoria.jsx'

const CONFIG_CATEGORIAS = {
  anillos: {
    titulo: 'Anillos',
    descripcion: 'Encuentra tu anillo que "nunca me quito" en nuestra selección de anillos, anillos de compromiso, anillos formativos y más. Tu próxima colección de anillos favoritos comienza aquí.',
  },
  pulseras: {
    titulo: 'Pulseras',
    descripcion: 'No es solo una joya, es un recordatorio tangible de que la suerte no ocurre por azar, sino porque llevas contigo la energía necesaria para atraerla; deja que esta pulsera sea el amuleto que sintonice tu destino con tus deseos.',
    subcategorias: [
      { value: 'Tobilleras', label: 'Tobilleras' },
    ],
  },
  aritos: {
    titulo: 'Aritos',
    descripcion: 'La distinción no es una coincidencia, es una elección. Estos pendientes han sido grabados con la firme convicción de que la elegancia es el imán definitivo de la fortuna.',
    apiCategoria: 'Aretes', // En la BD se guardan como "Aretes"
  },
  collares: {
    titulo: 'Collares',
    descripcion: 'El destino se rinde ante quienes caminan con seguridad; deja que este collar sea el destello que ilumine tu camino y atraiga hacia ti las sincronías perfectas que el universo tiene preparadas para quienes se atreven a brillar.',
    subcategorias: [
      { value: 'Set', label: 'Set' },
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

  // Usar el nombre de categoría de la API si existe un mapeo, sino usar el param de la URL
  const categoriaApi = config.apiCategoria || cat
  const { productos, loading, error } = useCategoria(categoriaApi)
  const [subcatActiva, setSubcatActiva] = useState('')

  const productosFiltrados = subcatActiva
    ? productos.filter((p) => p.subCategoria?.toLowerCase() === subcatActiva.toLowerCase())
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
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-sm font-medium">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-6 py-8 text-center text-red-700 text-sm">
            <p className="font-semibold mb-2">Hubo un problema al cargar los productos</p>
            <p className="text-xs">{error}</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-4 opacity-40"></span>
          
            <p className="text-sm font-medium">No hay productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6">
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
