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
        border: "hsl(var(--border, 140 5% 22%))",
        input: "hsl(var(--input, 140 5% 22%))",
        ring: "hsl(var(--ring, 18 51% 50%))",
        background: "hsl(var(--background, 140 6% 10%))",
        foreground: "hsl(var(--foreground, 40 25% 96%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 18 51% 50%))",
          foreground: "hsl(var(--primary-foreground, 0 0% 100%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 140 6% 16%))",
          foreground: "hsl(var(--secondary-foreground, 40 25% 96%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 60%))",
          foreground: "hsl(var(--destructive-foreground, 0 0% 100%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 140 5% 18%))",
          foreground: "hsl(var(--muted-foreground, 140 5% 65%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 19 62% 54%))",
          foreground: "hsl(var(--accent-foreground, 0 0% 100%))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 140 6% 12%))",
          foreground: "hsl(var(--popover-foreground, 40 25% 96%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 140 6% 13%))",
          foreground: "hsl(var(--card-foreground, 40 25% 96%))",
        },
        terracotta: {
          50: '#fdf7f4',
          100: '#faeee8',
          200: '#f5ddd2',
          300: '#ecc4b2',
          400: '#de9f85',
          500: '#c26e47',
          600: '#b86948',
          700: '#9b4f32',
          800: '#7f422b',
          900: '#683827',
        },
        charcoal: {
          50: '#f6f7f6',
          100: '#e1e3e1',
          200: '#c2c6c3',
          300: '#9da39e',
          400: '#6f7570',
          500: '#484d49',
          600: '#383c39',
          700: '#2c302d',
          800: '#222623',
          900: '#191c1a',
          950: '#121413',
        },
        cream: {
          50: '#fdfcf9',
          100: '#faf8f2',
          200: '#f6f3e8',
          300: '#ede8dc',
          400: '#dfd8c8',
        },
        editorial: {
          cream: '#FCF0DA',
          sage: '#AEAC78',
          gold: '#F2C46A',
          espresso: '#4C4541',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        condensed: ["'Bebas Neue'", 'Outfit', 'sans-serif'],
        editorial: ["'Newsreader'", "'Playfair Display'", 'Georgia', 'serif'],
        heading: ["'Outfit'", '-apple-system', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'ui-monospace', 'monospace'],
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
