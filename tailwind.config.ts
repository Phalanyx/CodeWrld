import { text } from "stream/consumers";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        border: "rgba(var(--border))",
        "main-text": "rgba(var(--main-text))",
        "cta-background": "rgba(var(--cta-background))",
        "cta-primary": "rgba(var(--cta-primary))",
        "cta-secondary": "rgba(var(--cta-secondary))",
        "cta-border": "rgba(var(--cta-border))",
        "cta-button": "rgba(var(--cta-button))",
      },
    },
  },
  plugins: [],
};
export default config;
