module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    project: ['./tsconfig.eslint.json', './*/tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  root: true,
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-param-reassign': ['error', { props: false }],
  },
  overrides: [
    {
      files: ['backend/**/*.ts', 'backend/**/*.js'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        'consistent-return': 'off',
        'no-console': 'off',
        'no-underscore-dangle': 'off',
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages packages come first.
              ['^@?\\w'],
              // Internal packages.
              [
                '^(constants|controllers|lib|middlewares|policies|routes|services|socket|structures|types|utils)(/.*|$)',
              ],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ],
          },
        ],
      },
    },
  ],
};
