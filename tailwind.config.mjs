/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--tw-border, 240 3.7% 15.9%))',
        input: 'hsl(var(--tw-input, 240 3.7% 15.9%))',
        ring: 'hsl(var(--tw-ring, 240 4.9% 83.9%))',
        background: 'hsl(var(--tw-background, 240 10% 3.9%))',
        foreground: 'hsl(var(--tw-foreground, 0 0% 98%))',
        primary: {
          DEFAULT: 'hsl(var(--tw-primary, 0 0% 98%))',
          foreground: 'hsl(var(--tw-primary-foreground, 240 5.9% 10%))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--tw-secondary, 240 3.7% 15.9%))',
          foreground: 'hsl(var(--tw-secondary-foreground, 0 0% 98%))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--tw-destructive, 0 62.8% 30.6%))',
          foreground: 'hsl(var(--tw-destructive-foreground, 0 0% 98%))',
        },
        muted: {
          DEFAULT: 'hsl(var(--tw-muted, 240 3.7% 15.9%))',
          foreground: 'hsl(var(--tw-muted-foreground, 240 5% 64.9%))',
        },
        accent: {
          DEFAULT: 'hsl(var(--tw-accent, 240 3.7% 15.9%))',
          foreground: 'hsl(var(--tw-accent-foreground, 0 0% 98%))',
        },
        card: {
          DEFAULT: 'hsl(var(--tw-card, 240 10% 3.9%))',
          foreground: 'hsl(var(--tw-card-foreground, 0 0% 98%))',
        },
      },
      animation: {
        spotlight: 'spotlight 2s ease .75s 1 forwards',
      },
      keyframes: {
        spotlight: {
          '0%': {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%,-40%) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};
