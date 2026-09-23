/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0B132B",
          800: "#1C2541",
        },
        forest: {
          950: "#0A231A",
        },
        burgundy: {
          950: "#4A0E17",
        },
        tealmask: {
          950: "#0D4A52",
        },
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        montserrat: ["'Montserrat'", "sans-serif"],
        cinzel: ["'Cinzel'", "serif"],
        greatvibes: ["'Great Vibes'", "cursive"],
        lato: ["'Lato'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
