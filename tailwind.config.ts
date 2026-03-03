import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        aura: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        shine: {
          '0%': { transform: 'translateX(-150%) skewX(-15deg)' },
          '55%, 100%': { transform: 'translateX(250%) skewX(-15deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(-15deg)' },
          '40%': { transform: 'rotate(15deg)' },
          '60%': { transform: 'rotate(-10deg)' },
          '80%': { transform: 'rotate(10deg)' },
        },
        'shake-interval': {
          '0%': { transform: 'rotate(0deg)' },
          '5%': { transform: 'rotate(-2.5deg)' },
          '10%': { transform: 'rotate(2.5deg)' },
          '15%': { transform: 'rotate(-1.5deg)' },
          '20%': { transform: 'rotate(1.5deg)' },
          '25%, 100%': { transform: 'rotate(0deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '30%': { transform: 'translateY(-10px) rotate(0.4deg)' },
          '60%': { transform: 'translateY(-6px) rotate(-0.3deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        shake: 'shake 2.5s ease-in-out infinite',
        'shake-interval': 'shake-interval 1.25s ease-in-out infinite',
        aura: 'aura 2.5s ease-out infinite',
        shine: 'shine 3s ease-in-out infinite',
        sway: 'sway 60s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
