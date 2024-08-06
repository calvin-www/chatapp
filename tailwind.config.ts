const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        fontFamily: {
          primary: "Inter",
          secondary: "Poppins",
        },
        background: "#0F172A",
        foreground: "#E2E8F0",
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#00FFFF",
          foreground: "#000000",
        },
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#0F172A",
            foreground: "#303a50",
            primary: {
              DEFAULT: "#3B82F6",
              foreground: "#0F172A",
            },
            secondary: {
              DEFAULT: "#87f1f1",
              foreground: "#000000",
            },
            focus: "#3B82F6",
          },
        },
      },
    }),
  ],
  content:[
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
};