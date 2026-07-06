import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#171a1f',
        graphite: '#242a32',
        steel: '#5c6875',
        line: '#d9dee5',
        field: '#f5f6f8',
        signal: '#176b58',
        alert: '#a13d2d',
        amber: '#b7791f',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        panel: '0 1px 2px rgb(16 24 40 / 0.08), 0 8px 24px rgb(16 24 40 / 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config;
