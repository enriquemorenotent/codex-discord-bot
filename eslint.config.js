import js from '@eslint/js';

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly',
  global: 'readonly'
};

export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: nodeGlobals,
    },
    rules: js.configs.recommended.rules,
  },
  {
    files: ['**/__tests__/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...nodeGlobals,
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
    rules: js.configs.recommended.rules,
  },
];
