/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#151515",
        cream: "#f8f6f1",
        accent: "#ff5a36",
      },
    },
  },
  plugins: [],
};
