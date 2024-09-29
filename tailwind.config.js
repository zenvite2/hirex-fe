/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#1E40AF',
        customRed: '#FF5733',
        customGray: '#B0BEC5',
      },
    },
  },
  plugins: [],
}