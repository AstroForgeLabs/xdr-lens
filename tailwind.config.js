/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stellar: {
          dark: '#0e171f',
          card: '#162029',
          border: '#29343d',
          accent: '#5555ff',
          accentHover: '#4444dd',
          green: '#53db53',
          red: '#ff5555',
          amber: '#ffc555',
          cyan: '#38bdf8',
          purple: '#a855f7',
        },
      },
    },
  },
  plugins: [],
};
