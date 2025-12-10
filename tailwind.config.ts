import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cave: {
          dark: '#1a1612',
          DEFAULT: '#2d2926',
          light: '#3d3630',
        },
        stone: {
          dark: '#3d3630',
          DEFAULT: '#5c554d',
          light: '#7a726a',
        },
        sand: {
          dark: '#a08968',
          DEFAULT: '#c4a882',
          light: '#d9c9a8',
        },
        bone: {
          dark: '#e8e0d0',
          DEFAULT: '#f5f0e6',
          light: '#fdfcfa',
        },
        fire: {
          dark: '#b8521f',
          DEFAULT: '#d4622a',
          light: '#e87f45',
        },
        blood: {
          dark: '#6b2828',
          DEFAULT: '#8b3a3a',
          light: '#a54a4a',
        },
        moss: {
          dark: '#4a5740',
          DEFAULT: '#5c6b4d',
          light: '#6e7d5f',
        },
      },
      fontFamily: {
        grug: ['Titan One', 'cursive'],
        body: ['DM Sans', 'sans-serif'],
        scribble: ['Caveat', 'cursive'],
      },
      borderRadius: {
        stone: '12px',
        rock: '16px',
      },
      boxShadow: {
        fire: '0 4px 14px 0 rgba(212, 98, 42, 0.25)',
        cave: '0 4px 14px 0 rgba(26, 22, 18, 0.5)',
        stone: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'grain': "url('/grain.png')",
        'cave-gradient': 'linear-gradient(180deg, #1a1612 0%, #2d2926 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
