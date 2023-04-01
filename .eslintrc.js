module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'commonjs': true,
    'es2021': true,
    'jest': true
  },
  'extends': [
    "plugin:@next/next/recommended",
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'overrides': [
  ],
  'settings': {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    "ecmaFeatures": { jsx: true }
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'react/jsx-no-undef': 0,
    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/rule-name': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-array-constructor': 0,
    '@typescript-eslint/no-this-alias': 0,
    'indent': [0, 4],
    'linebreak-style': [0],
    'semi': ['error', 'always'],
    'for-direction': 2,
    'no-cond-assign': 2,
    'no-dupe-args': 1,
    'no-dupe-keys': 2,
    'no-duplicate-case': 0,
    'no-empty': 0,
    'no-empty-function': 0,
    '@typescript-eslint/no-empty-function': 0,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 1,
    'no-extra-parens': [0],
    'no-extra-semi': 1,
    'no-inner-declarations': [0, 'both'],
    'no-invalid-regexp': 1,
    'no-irregular-whitespace': 1,
    'no-misleading-character-class': 1,
    'no-obj-calls': 1,
    'no-regex-spaces': 1,
    'no-sparse-arrays': 1,
    'no-unexpected-multiline': 2,
    'no-unreachable': 1,
    'no-unsafe-finally': 2,
    'no-unsafe-negation': 0,
    'require-atomic-updates': 2,
    'use-isnan': 0,
    'curly': 0,
    'no-case-declarations': 2,
    'no-empty-pattern': 2,
    'no-eval': 2,
    'no-extra-bind': 1,
    'no-extra-label': 1,
    'no-fallthrough': 1,
    'no-global-assign': 2,
    'no-implied-eval': 1,
    'no-invalid-this': 1,
    'no-lone-blocks': 1,
    'no-loop-func': 1,
    'no-magic-numbers': 0,
    'no-redeclare': 2,
    'no-self-assign': 2,
    'no-self-compare': 1,
    'no-useless-catch': 1,
    'no-unused-labels': 1,
    'no-useless-escape': 2,
    'no-useless-return': 1,
    'no-with': 2,
    'vars-on-top': 1,
    'no-unused-vars': 1,
    'no-use-before-define': 0,
    'no-shadow-restricted-names': 1,
    'no-delete-var': 2,
    'block-spacing': [1, 'always'],
    'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
    'camelcase': 2,
    'comma-spacing': [1, { after: true }],
    'comma-style': [2, 'last'],
    'computed-property-spacing': 0,
    'function-paren-newline': [1, 'multiline'],
    'implicit-arrow-linebreak': [2, 'beside'],
    'no-mixed-spaces-and-tabs': 1,
    'max-len': [
      1,
      128,
      4,
      {
        'ignoreStrings': true,
        'ignoreRegExpLiterals': true,
        'ignoreTemplateLiterals': true,
        'ignoreUrls': true
      }
    ],
    'new-parens': 2,
    'new-cap': 1,
    'no-bitwise': 2,
    'no-lonely-if': 1,
    'no-multiple-empty-lines': [1, { 'max': 16, 'maxEOF': 3, 'maxBOF': 3 }],
    'no-unneeded-ternary': 1,
    'object-curly-newline': [2, { 'multiline': true }],
  }
};