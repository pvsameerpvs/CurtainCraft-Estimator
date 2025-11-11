/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#f97316', // warm orange accent
          dark: '#ea580c',
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
