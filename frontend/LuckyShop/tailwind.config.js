/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          50:  '#fff0f6',
          100: '#ffd6e8',
          200: '#ffaed0',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
      },
    },
  },
  plugins: [],
}
