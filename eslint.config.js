import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Feature-boundary rule: other code may only import a feature's public
      // index (@features/<name>), never its internals. Relative imports inside
      // a feature are untouched (they don't go through the alias).
      'no-restricted-imports': ['warn', {
        patterns: [
          {
            group: ['@features/*/*'],
            message: "Import from the feature's public index (@features/<name>) instead of its internals.",
          },
          {
            group: ['@/features/*'],
            message: 'Use the @features/<name> alias (public index) instead of @/features paths.',
          },
        ],
      }],
    },
  },
])
