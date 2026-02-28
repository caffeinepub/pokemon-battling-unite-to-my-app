/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Mona Sans"', 'sans-serif'],
        body: ['Sora', '"Mona Sans"', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          foreground: 'oklch(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        // Elemental Ninja palette
        'el-fire': 'oklch(var(--fire))',
        'el-water': 'oklch(var(--water))',
        'el-air': 'oklch(var(--air))',
        'el-earth': 'oklch(var(--earth))',
        'el-gold': 'oklch(var(--gold))',
        'el-earth-gold': 'oklch(var(--earth-gold))',
        'el-ink': 'oklch(var(--ink))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'fire-glow': '0 0 15px oklch(0.62 0.23 30 / 0.7), 0 0 35px oklch(0.62 0.23 30 / 0.3)',
        'water-glow': '0 0 15px oklch(0.65 0.19 220 / 0.7), 0 0 35px oklch(0.65 0.19 220 / 0.3)',
        'air-glow': '0 0 15px oklch(0.82 0.13 160 / 0.6), 0 0 35px oklch(0.82 0.13 160 / 0.25)',
        'earth-glow': '0 0 15px oklch(0.75 0.14 75 / 0.6), 0 0 35px oklch(0.75 0.14 75 / 0.25)',
        'gold-glow': '0 0 20px oklch(0.78 0.17 85 / 0.8), 0 0 50px oklch(0.78 0.17 85 / 0.4)',
        'card': '0 4px 24px oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.04)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};
