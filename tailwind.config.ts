// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'   // incluye todos los TSX y JSX
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

export default config
