/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c5ff',
          400: '#859dff',
          500: '#5c70ff',
          600: '#3d46ff',
          700: '#2b30e6',
          800: '#2428bc',
          900: '#222795',
          950: '#14165a',
        },
      },
    },
  },
  plugins: [],
}
