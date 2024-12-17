import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1c1c1c",
        foreground: "var(--foreground)",
        "btn-background": "#1e1e1e",
        delete: "#d24949",
        overlay: "#0f0f0f",
        secondary: "#cbcbcb",
        "background-text": "#333333",
        icon: "#718096",
      },
      fontFamily: {
        sans: ["var(--font-source-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
