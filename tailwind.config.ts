import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["ui-serif", "Georgia", "Times New Roman", "serif"],
        body: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 30px rgba(17, 17, 17, 0.10)",
      },
      colors: {
        parchment: "#fbf6ee",
        ink: "#141414",
        rose: "#b86a6a",
        antique: "#bfa16a",
        cocoa: "#3b2f2a",
      },
      backgroundImage: {
        "vintage-radial": "radial-gradient(70% 90% at 50% 0%, rgba(20,20,20,0.08), transparent 70%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
