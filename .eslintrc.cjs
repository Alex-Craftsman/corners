/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'unused-imports',
  ],
  extends: [
    'next/core-web-vitals',
    'prettier',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
  ],
  rules: {
    'tailwindcss/classnames-order': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'sort-imports': 'off',
    'tailwindcss/no-custom-classname': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'simple-import-sort/imports': [
      2,
      {
        groups: [
          ['^.+\\.s?css$'],
          [
            `^(${require('module').builtinModules.join('|')})(/|$)`,
            '^react',
            '^@?\\w',
          ],
          ['^components(/.*|$)'],
          ['^lib(/.*|$)', '^hooks(/.*|$)'],
          ['^\\.'],
        ],
      },
    ],
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // `react` first, `next` second, then packages starting with a character
              ['^react', '^next', '^[a-z]'],
              //
              ['^@'],
              // Imports starting with `../`
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Imports starting with `./`
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              //
              ['(.css)$'],
            ],
          },
        ],
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ],
  settings: {
    tailwindcss: {
      callees: ['cn'],
      config: 'tailwind.config.js',
    },
  },
  ignorePatterns: [
    'dist/*',
    '.cache',
    'public',
    'node_modules',
    '*.esm.js',
    'commitlint.config.mjs',
  ],
};
module.exports = config;
