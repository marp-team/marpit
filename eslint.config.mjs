import babelParser from '@babel/eslint-parser'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginImportX, {
  flatConfigs as eslintPluginImportXConfigs,
} from 'eslint-plugin-import-x'
import globals from 'globals'

export default [
  js.configs.recommended,
  eslintPluginImportXConfigs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parser: babelParser,
      globals: {
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      import: eslintPluginImportX,
    },
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
        },
      ],
      'max-len': [
        'error',
        {
          code: 80,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreComments: false,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },
  {
    files: ['test/**/*', 'jest.*'],
    languageOptions: {
      globals: {
        ...globals.jest,
        context: 'readonly',
      },
    },
  },
  {
    ignores: [
      'coverage/**/*',
      'dist/**/*',
      'docs/**/*',
      'jsdoc/**/*',
      'lib/**/*',
      'node_modules/**/*',
      'plugin.js',
    ],
  },
]
