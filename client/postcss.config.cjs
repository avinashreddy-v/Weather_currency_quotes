module.exports = {
  plugins: {
    // Use the PostCSS plugin package for Tailwind. This matches the installed dependency
    // `@tailwindcss/postcss` and prevents the runtime error about using `tailwindcss` as a PostCSS plugin.
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
