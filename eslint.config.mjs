import { combine, javascript, typescript, stylistic } from '@antfu/eslint-config'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'

export default combine(
  javascript({
    overrides: {
      'no-unused-vars': 'off',
      'no-console': 'off',
    },
  }),

  typescript(),

  stylistic({
    lessOpinionated: true,
    jsx: false,
    semi: false,
    quotes: 'single',
    overrides: {
      'style/indent': ['error', 2],
      'style/quotes': ['error', 'single'],
      'style/max-statements-per-line': 'off',
    },
  }),

  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-use-before-define': 'off',
      'ts/no-use-before-define': 'off',
      'ts/consistent-type-imports': 'off',
      'antfu/consistent-list-newline': 'off',
      'curly': 'warn',
      'prefer-template': 'warn',
      '@next/next/no-img-element': 'off',
      'style/brace-style': 'off',
      'style/indent': 'off',
      'style/quotes': 'off',
      'style/multiline-ternary': 'off',
      'style/quote-props': 'off',
      'style/member-delimiter-style': 'off',
      'style/arrow-parens': 'off',
      'style/eol-last': 'off',
      'style/no-trailing-spaces': 'off',
    },
  },

  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/.next/**',
      '**/public/**',
      '**/*.json',
      'tailwind.config.js',
      'next.config.js',
    ],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2025,
        ...globals.node,
        React: 'readable',
        JSX: 'readable',
      },
    },
  },
)
