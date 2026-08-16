// Footer.jsx — pie de página de Lucky Shop

/* Iconos SVG de redes sociales */
// Ícono de TikTok
const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
)

// Ícono de Instagram
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

// Ícono de Facebook
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

// Ícono de "compartir" (usado en el botón de compartir sitio)
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

const Footer = () => (
  // Contenedor principal del footer, fondo rosado
  <footer className="bg-[#fbdce6] mt-16" id="footer">
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Nombre de la marca y derechos de autor */}
        <div className="text-center sm:text-left">
          <p
            className="text-gray-800 text-lg mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}
          >
            Lucky Shop
          </p>
          <p className="text-xs text-gray-600">©2026 Lucky Shop. La suerte en un adorno</p>
        </div>

        {/* Enlaces a páginas de políticas y contacto */}
        <div className="flex gap-12 text-sm">
          <a 
            href="/politicas"
            className="text-gray-700 hover:text-pink-500 font-medium transition-colors"
            id="footer-politicas"
          >
            Políticas
          </a>
          <a 
            href="/contactanos"
            className="text-gray-700 hover:text-pink-500 font-medium transition-colors"
            id="footer-contactanos"
          >
            Contáctanos
          </a>
        </div>

        {/* Íconos de redes sociales y botón de compartir */}
        <div className="flex gap-5 text-gray-800" id="footer-social">
          <a 
            href="https://www.tiktok.com/@lucky_shopsv"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
            title="TikTok"
          >
            <TikTokIcon />
          </a>
          <a 
            href="https://www.instagram.com/lucky_shopsv"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
            title="Instagram"
          >
            <InstagramIcon />
          </a>
          <a 
            href="https://www.facebook.com/share/1997RWBRXo/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
            title="Facebook"
          >
            <FacebookIcon />
          </a>

          {/* Botón de compartir: usa la API nativa del navegador si existe, o copia el link al portapapeles */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Lucky Shop', url: window.location.origin })
              } else {
                navigator.clipboard.writeText(window.location.origin)
                alert('¡Enlace copiado!')
              }
            }}
            className="hover:text-pink-500 transition-colors"
            title="Compartir"
          >
            <ShareIcon />
          </button>
        </div>

      </div>
    </div>
  </footer>
)

export default Footer;