/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // "Dusk in the Glen" — fixed tokens (design.md §2)
        forest: "#16302B",
        "forest-deep": "#0E211D",
        "forest-soft": "#1E4038",
        evergreen: "#2E5945",
        "evergreen-bright": "#3E7360",
        sage: "#8FA896",
        brass: "#C4A24C",
        "brass-soft": "#D9C08A",
        parchment: "#F6F1E7",
        "parchment-deep": "#EDE4D3",
        ink: "#1C1C1A",
        "ink-soft": "#5A5648",
        bone: "#EDE7DA",
        ember: "#B4552D",
        // Semantic mode-aware tokens (switch Parchment/Dusk)
        bg: "var(--bg)",
        surface: "var(--surface)",
        well: "var(--well)",
        body: "var(--text)",
        soft: "var(--text-soft)",
        // shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
        reading: "720px",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        raised: "0 1px 2px rgba(22,48,43,0.06), 0 8px 24px rgba(22,48,43,0.06)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        flicker: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)", filter: "hue-rotate(0deg)" },
          "18%": { transform: "scaleY(1.05) scaleX(0.97)", filter: "hue-rotate(-6deg)" },
          "35%": { transform: "scaleY(0.95) scaleX(1.02)", filter: "hue-rotate(4deg)" },
          "52%": { transform: "scaleY(1.06) scaleX(0.96)", filter: "hue-rotate(-3deg)" },
          "71%": { transform: "scaleY(0.94) scaleX(1.03)", filter: "hue-rotate(6deg)" },
          "86%": { transform: "scaleY(1.02) scaleX(0.98)", filter: "hue-rotate(0deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "halo-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(196,162,76,0.45)" },
          "100%": { boxShadow: "0 0 0 22px rgba(196,162,76,0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        flicker: "flicker 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.4s ease-out both",
        "halo-pulse": "halo-pulse 1s ease-out 1",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
