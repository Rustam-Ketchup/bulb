import { FlatCompat } from '@eslint/eslintrc'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  stylistic.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      'arrow-body-style': ['error', 'as-needed'],
      'object-curly-spacing': [
        'error',
        'always',
        {
          arraysInObjects: true,
          objectsInObjects: true,
        },
      ],
      'import/order':
        [
          1,
          {
            'groups':
              [
                'external',
                'builtin',
                'internal',
                'sibling',
                'parent',
                'index',
              ],
            'newlines-between': 'always',
            'pathGroups': [
              {
                // Тут pattern любое название папки
                pattern: 'components',
                group: 'internal',
              },
            ],
            'pathGroupsExcludedImportTypes':
              ['internal'],
            'alphabetize': {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
    },
  },
]

export default config
