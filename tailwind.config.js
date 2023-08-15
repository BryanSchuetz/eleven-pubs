module.exports = {
  content: ["src/**/*.liquid","src/site/index.liquid"],
  safelist: [],
  theme: {
    extend: {
      colors: {
        change: "orange",
        daiBlue: "#a1c7e3",
        daiGreen: "#9bce36",
        daiDark: "#404d59",
        daiGray02: "#56687b",
        daiLightBlue: "#d3e3f0",
        daiLightGray: "#e4e5e6",
        daiPurple: "#644C85",
        daiLinks: "#1e7ab3"
      },
      screens: {
        'mediumish': '1166px',
      }
    }
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],

};