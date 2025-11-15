/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          50: "#fafafa",
          100: "#f7f8f9",
          200: "#f0f1f1",
          300: "#e8e8e8",
          400: "#d1d1d2",
          500: "#babbbb",
          600: "#8c8d8d",
          700: "#5e6060",
          800: "#474949",
          900: "#303232",
          950: "#191b1c",
        },
        "eastern-blue": {
          50: '#eefdfd',
          100: '#d4f9f9',
          200: '#aef1f3',
          300: '#76e5ea',
          400: '#37cfd9',
          500: '#1bb4bf',
          600: '#1a92a2',
          700: '#1c7482',
          800: '#1f5f6b',
          900: '#1e4f5b',
          950: '#0e343e',
        },
        'crusta': {
          50: '#fff5ed',
          100: '#ffe8d4',
          200: '#ffcea8',
          300: '#ffab71',
          400: '#ff7a34',
          500: '#fe5911',
          600: '#ef3f07',
          700: '#c62b08',
          800: '#9d240f',
          900: '#7e2010',
          950: '#440c06',
        },
      },
    },
  },
  plugins: [],
}

