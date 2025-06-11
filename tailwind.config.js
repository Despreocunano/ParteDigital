/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['PT Serif', 'serif'],
        lora: ['Lora', 'serif'],
        parisienne: ['Parisienne', 'cursive'],
      },
    },
  },
  plugins: [],
};
