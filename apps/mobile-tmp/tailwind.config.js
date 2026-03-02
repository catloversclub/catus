/** @type {import('tailwindcss').Config} */
const colors = require("./styles/colors");
const { fontSize } = require("./styles/typography");

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontSize,
    },
  },
  plugins: [],
};
