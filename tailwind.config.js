/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        aurora: {
          50: '#f0f9ff',
          900: '#0a0a1a',
          dark: '#050510',
          void: '#02020d',
        }
      }
    },
  },
  plugins: [],
}
