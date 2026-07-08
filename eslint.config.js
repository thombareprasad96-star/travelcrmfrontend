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
      // ── React-Compiler-preview + HMR rules: downgraded to WARN, deliberately.
      // These flag real modernization work (moving setState out of effects,
      // hoisting nested components, purity fixes) whose "fixes" change runtime
      // behavior. The structural refactor (Phases 0-5) is zero-behavior-change,
      // so this debt stays VISIBLE as warnings and is burned down as its own
      // workstream. Do not silence individual instances with eslint-disable.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-refresh/only-export-components': 'warn',

      // Feature-boundary rule: other code may only import a feature's public
      // index (@features/<name>), never its internals. Relative imports inside
      // a feature are untouched (they don't go through the alias).
      'no-restricted-imports': ['error', {
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
