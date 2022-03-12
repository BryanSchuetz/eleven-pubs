module.exports = {
  content: ["dist/**/*.html"],
  safelist: [],
  theme: {
    extend: {
      colors: {
        change: "orange",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
