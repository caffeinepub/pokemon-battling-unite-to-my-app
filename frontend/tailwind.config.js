/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        bangers: ['Bangers', 'cursive'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        noto: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Elemental Ninja palette
        fire: {
          DEFAULT: '#ff4757',
          dark: '#8b1a24',
          light: '#ff8a94',
        },
        water: {
          DEFAULT: '#00d2ff',
          dark: '#005f7a',
          light: '#7eeaff',
        },
        earth: {
          DEFAULT: '#c8a96e',
          dark: '#5c4a2a',
          light: '#e8d4a8',
        },
        wind: {
          DEFAULT: '#2ecc71',
          dark: '#145c33',
          light: '#82e8b0',
        },
        lightning: {
          DEFAULT: '#f1c40f',
          dark: '#6b5600',
          light: '#f8e07a',
        },
        shadow: {
          DEFAULT: '#9b59b6',
          dark: '#3d1f4d',
          light: '#c99fd8',
        },
        ninja: {
          dark: '#0f0f1e',
          darker: '#07070f',
          mid: '#1a1a2e',
          light: '#2a2a4e',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'fire-glow': '0 0 15px #ff4757, 0 0 30px #ff475740',
        'water-glow': '0 0 15px #00d2ff, 0 0 30px #00d2ff40',
        'earth-glow': '0 0 15px #c8a96e, 0 0 30px #c8a96e40',
        'wind-glow': '0 0 15px #2ecc71, 0 0 30px #2ecc7140',
        'lightning-glow': '0 0 15px #f1c40f, 0 0 30px #f1c40f40',
        'shadow-glow': '0 0 15px #9b59b6, 0 0 30px #9b59b640',
        'ninja-card': '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
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
      backgroundImage: {
        'ninja-gradient': 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #0f0f1e 100%)',
        'fire-gradient': 'linear-gradient(135deg, #8b1a24 0%, #ff4757 100%)',
        'water-gradient': 'linear-gradient(135deg, #005f7a 0%, #00d2ff 100%)',
        'earth-gradient': 'linear-gradient(135deg, #5c4a2a 0%, #c8a96e 100%)',
        'wind-gradient': 'linear-gradient(135deg, #145c33 0%, #2ecc71 100%)',
        'lightning-gradient': 'linear-gradient(135deg, #6b5600 0%, #f1c40f 100%)',
        'shadow-gradient': 'linear-gradient(135deg, #3d1f4d 0%, #9b59b6 100%)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};
