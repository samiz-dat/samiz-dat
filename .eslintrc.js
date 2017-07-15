module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'airbnb-base',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      'webpack': {
        'config': './.electron-vue/webpack.renderer.config.js'
      }
    }
  },
  rules: {
    "max-len": 0,
    'global-require': 0,
    "generator-star-spacing": 0,
    "no-param-reassign": ["error", { "props": false }],
    "no-restricted-syntax": 0,
    "no-plusplus":0,
    "no-console": 0,
    'no-shadow': 0,
    'no-multi-assign': 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.js", "**/*.spec.js"]}],
    "import/extensions": ["error", "always", {
      "js": "never",
      "vue": "never",
    }],
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
