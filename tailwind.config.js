/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        claude: {
          bg: '#FAF9F5',
          card: '#FFFFFF',
          border: '#E8E6DF',
          muted: '#6B6966',
          text: '#1F1E1D',
          hover: '#F0EFEA',
          accent: '#C25E34', // warm terracotta accent
          accentHover: '#A84E29',
          darkBg: '#131312',
          darkCard: '#1C1B1A',
          darkBorder: '#2E2D2A',
          darkText: '#EDECE8',
          darkMuted: '#9B9994',
          darkHover: '#262523',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      transitionTimingFunction: {
        'claude': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
