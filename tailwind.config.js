/** @type {import('tailwindcss').Config} */
export default {
  presets: [require("@vercel/examples-ui/tailwind")],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@vercel/examples-ui/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
