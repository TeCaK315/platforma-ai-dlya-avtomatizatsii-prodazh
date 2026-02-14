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
        primary: '#4A90E2',
        secondary: '#50E3C2',
        accent: '#F5A623',
        background: '#1F1F1F',
        text: '#EAEAEA',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;