/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border, 215 28% 17%))",
        input: "hsl(var(--input, 215 28% 17%))",
        ring: "hsl(var(--ring, 142 76% 36%))",
        background: "hsl(var(--background, 222 47% 7%))",
        foreground: "hsl(var(--foreground, 210 40% 98%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 142 76% 36%))",
          foreground: "hsl(var(--primary-foreground, 144 61% 5%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 217 33% 17%))",
          foreground: "hsl(var(--secondary-foreground, 210 40% 98%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 60%))",
          foreground: "hsl(var(--destructive-foreground, 210 40% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 217 33% 15%))",
          foreground: "hsl(var(--muted-foreground, 215 20% 65%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 84 81% 55%))",
          foreground: "hsl(var(--accent-foreground, 144 61% 5%))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 222 47% 10%))",
          foreground: "hsl(var(--popover-foreground, 210 40% 98%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 222 47% 11%))",
          foreground: "hsl(var(--card-foreground, 210 40% 98%))",
        },
      },
      borderRadius: {
        lg: "var(--radius, 0.75rem)",
        md: "calc(var(--radius, 0.75rem) - 2px)",
        sm: "calc(var(--radius, 0.75rem) - 4px)",
      },
    },
  },
  plugins: [],
};
