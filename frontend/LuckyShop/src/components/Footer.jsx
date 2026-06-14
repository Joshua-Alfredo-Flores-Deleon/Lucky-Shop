// Footer.jsx
const Footer = () => (
  <footer className="bg-pink-100 mt-12">
    <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <p className="font-bold text-pink-600 text-sm">Lucky Shop</p>
        <p className="text-xs text-gray-500">© 2026. Lucky Shop. La suerte en un adorno</p>
      </div>
      <div className="flex gap-6 text-sm text-gray-600">
        <a href="#" className="hover:text-pink-500">Políticas</a>
        <a href="#" className="hover:text-pink-500 underline">Contáctanos</a>
      </div>
      <div className="flex gap-3 text-xl">
        <a href="#" className="hover:text-pink-500"></a>
        <a href="#" className="hover:text-pink-500"></a>
        <a href="#" className="hover:text-pink-500"></a>
      </div>
    </div>
  </footer>
)

export default Footer
