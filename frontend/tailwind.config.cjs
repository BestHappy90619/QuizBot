/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      miniPhone: "360px",
      mobile: "400px",
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
    },
    colors: {
      "custom-txt-clr": "#000000",
      "custom-icon-clr": "#BFCF60",
      "custom-btn-clr": "#BFCF60",
      "custom-gray": "#747474",
    },
  },
  plugins: [],
});
