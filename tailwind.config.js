/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
         'forsan-green': '#88a74dff',
         'forsan-green-dark': '#5f7635ff',
          'forsan-dark': '#263a64ff',
      },


    },
  },
  plugins: [],
}