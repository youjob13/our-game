// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const changeDetectionStrategy = require('eslint-plugin-change-detection-strategy');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      importPlugin.flatConfigs.recommended,
      prettier,
    ],
    plugins: {
      'change-detection-strategy': changeDetectionStrategy,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      'change-detection-strategy/on-push': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // 1. Node.js built-ins
            'external', // 2. External modules
            'internal', // 3. Local modules (npm workspaces)
            'parent', // 4. Absolute imports (parent directories)
            ['sibling', 'index'], // 5. Relative imports (same directory and index files)
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@app/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-cycle': 'error',
      'import/no-relative-packages': 'error',
      'import/named': 'off',
      'import/no-unresolved': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
