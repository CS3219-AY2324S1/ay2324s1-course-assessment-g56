module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    'prettier'
  ],
  parserOptions: {
    project: ['./tsconfig.eslint.json', './*/tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname
  },
  root: true,
}