/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#9ca3af", //bg-gray-400
        green: "#65a30d", //bg-lime-600
        yellow: "#eab308", //bg-yellow-500
        grayish: "#4b5563" //bg-gray-600
      }
    },
  },
  plugins: [],
}