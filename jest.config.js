module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/typescript',
    transform: {
        '^.+\\.vue$': 'vue-jest',
    },
    testMatch: ['**/src/**/*.spec.[jt]s?(x)', '**/tests/unit/**/*.spec.[jt]s?(x)', '**/__tests__/*.[jt]s?(x)'],
};
