module.exports = {
  reportUnusedDisableDirectives: true,
  root: true,
  env: { node: true, es6: true },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  ignorePatterns: ['coverage', 'lib', 'module', 'types'],
  rules: {
    'import/order': ['error', { alphabetize: { order: 'asc' } }],
  },
  settings: {
    'import/ignore': ['@rollup/plugin-node-resolve'],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
      settings: {
        'import/resolver': {
          typescript: { alwaysTryTypes: true, project: __dirname },
        },
      },
    },
  ],
}
