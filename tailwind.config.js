/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#7d9695',
        secondary: '#40615e',
        ternary: '#2d4d4a',
        darkColor: '#224341',
        theme: '#ffd444'
      },
      fontFamily: {
        roboto: 'Roboto',
        berlin: 'Berlin Sans FB',
        indie: 'Indie Flower',
        play: 'Playwrite ES Deco',
        macondo: 'Macondo'
      }
    },
  },
  plugins: [],
}

