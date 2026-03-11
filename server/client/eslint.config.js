import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
  plugins: [react()],
  server: {
    port: 5173,
 proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      //'/api': 'http://localhost:3000'

      // '/': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true,
      // }
    }
  },
  },
])

    // proxy: {
    //   // Проксировать всё, что не начинается с /@ или /src или /node_modules
    //   '^(?!/@|/src|/node_modules|/__vite_ping).*$': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //   }
