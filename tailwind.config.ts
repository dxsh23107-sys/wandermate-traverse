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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: '#fbf7ee',
          100: '#f5edd4',
          200: '#edd6a6',
          300: '#e3ba73',
          400: '#dc9e47',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
          950: '#270e01',
        },
        earth: {
          50: '#f7f6f3',
          100: '#eeebe4',
          200: '#ddd6c8',
          300: '#c5bba6',
          400: '#ab9b82',
          500: '#958169',
          600: '#796653',
          700: '#615143',
          800: '#504339',
          900: '#443a32',
          950: '#251e19',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        dark: {
          800: '#151d28',
          850: '#0f1722',
          900: '#0a0f18',
          950: '#06090e',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "radial-gradient(circle at center, rgba(217, 119, 6, 0.08) 0, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
