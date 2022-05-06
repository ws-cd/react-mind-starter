module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      textColor: {
        primary: '#039BE5',
        secondary: '#ffed4a',
        danger: '#e3342f'
      },
      zIndex: {
        '-99': '-99'
      },
      height: {
        '2h': '200%'
      },
      width: {
        '2w': '200%'
      },
      fill: {
        transparent: 'transparent'
      },
      strokeWidth: {
        3: '3',
        4: '4'
      }
    }
  },
  variants: {
    // eslint-disable-next-line prettier/prettier
    extend: {}
  },
  plugins: []
};
