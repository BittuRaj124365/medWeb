/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D9488",
        accent: "#3B82F6",
        background: "#FAFAFA",
        textMain: "#1F2937"
      }
    },
  },
  plugins: [],
}
