module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended'
    ],
    'rules': {
        'block-scoped-var': 'error',
        'camelcase': 'error',
        'comma-dangle': ['error', 'always-multiline'],
        'curly': 'error',
        'default-case-last': 'error',
        'eol-last': ['error', 'always'],
        'eqeqeq': 'error',
        'guard-for-in': 'error',
        'linebreak-style': 'error',
        'max-len': ['error', { 'code': 120 }],
        'no-alert': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-debugger': 'error',
        'no-empty-pattern': 'error',
        'no-eval': 'error',
        'no-explicit-any': false,
        'no-extra-bind': 'error',
        'no-extra-boolean-cast': 'error',
        'no-extra-semi': 'error',
        'no-floating-decimal': 'error',
        'no-implied-eval': 'error',
        'no-inner-declarations': 'error',
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-non-null-assertion': false,
        'no-octal': 'error',
        'no-unexpected-multiline': 'off',
        'no-unreachable': 'error',
        'no-useless-rename': 'error',
        'no-console': 'error',
        'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
        'semi': ['error', 'always'],
    },
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}
