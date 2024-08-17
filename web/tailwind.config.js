const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          
          "primary": "#9945FF",     // Purple
          "primary-content": "#ffffff",
          "secondary": "#14F195",   // Bright Green
          "accent": "#FF8C94",      // Muted Coral
          "neutral": "#374151",     // Dark Gray
          "base-100": "#121212",    // Very dark background
          "info": "#5A9BD5",        // Muted Blue for info
          "success": "#3D9970",     // Muted Green for success
          "warning": "#FFAA33",     // Muted Amber for warning
          "error": "#D9534F",       // Muted Red for error
          },
        },
      ],
    },
  plugins: [require('daisyui'), require('tailwindcss-animated')],
};
