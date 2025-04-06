module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // important: '#root',
  // corePlugins: {
  //   preflight: false,
  // },
   theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [],
};
