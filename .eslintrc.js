module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['prettier'],
  plugins: ['prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['*.ts'],
      extends: ['standard-with-typescript', 'prettier'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
  },
};
