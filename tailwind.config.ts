import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e50914",
        dark: "#0c0c0c",
        muted: "#f4f4f5"
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 10px 40px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: [typography]
};

export default config;
