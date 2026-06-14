/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f0f5f0',
          100: '#dceadc',
          200: '#b9d4ba',
          300: '#8fb991',
          400: '#7C9A7E',
          500: '#5e7f60',
          600: '#4a664c',
          700: '#3c533e',
          800: '#324333',
          900: '#2a372c',
        },
        cream: '#F8F5F0',
        muted: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe-in':  'breatheIn  var(--breathe-in)  ease-in-out  forwards',
        'breathe-out': 'breatheOut var(--breathe-out) ease-in-out  forwards',
        'breathe-hold':'breatheHold var(--breathe-hold) linear      forwards',
      },
      keyframes: {
        breatheIn: {
          '0%':   { transform: 'scale(1)',   opacity: '0.7' },
          '100%': { transform: 'scale(1.5)', opacity: '1' },
        },
        breatheOut: {
          '0%':   { transform: 'scale(1.5)', opacity: '1' },
          '100%': { transform: 'scale(1)',   opacity: '0.7' },
        },
        breatheHold: {
          '0%, 100%': { transform: 'scale(1.5)' },
        },
      },
    },
  },
  plugins: [],
};
