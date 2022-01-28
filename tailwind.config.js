module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
