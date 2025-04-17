import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // ← Bunu ekledik ✅
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
