/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shark: '#1E1E20',
        foam: '#CCFDFB',
        tidal: '#E3FCB3',
        radicalRed: '#FF385C'
      }
    },
  },
  plugins: [],
}