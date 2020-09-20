if (process.env.NODE_ENV === 'production') {
  module.exports = {}
} else {
  module.exports = {
    env: {
      browser: true,
      es2020: true,
    },
    extends: [
      'plugin:react/recommended',
      'react-app',
      'airbnb',
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 11,
      sourceType: 'module',
    },
    plugins: [
      'react',
    ],
    rules: {
      'linebreak-style': 'off',
      'no-console': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/prop-types': [0, {}],
    },
  }
}