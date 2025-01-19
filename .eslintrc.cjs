/* eslint-env node */
// require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,

    plugins: ['jsdoc'],

    extends: [
        'plugin:vue/vue3-essential',
        "plugin:vue/vue3-strongly-recommended",
        "plugin:vue/vue3-recommended",
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier/skip-formatting',
    ],

    rules: {
        'jsdoc/no-undefined-types': 1,
    },

    overrides: [
        {
            files: [
                '**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
                'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
                'cypress/support/**/*.{js,ts,jsx,tsx}',
            ],
            extends: ['plugin:cypress/recommended'],
        },
    ],

    parserOptions: {
        ecmaVersion: 'latest',
    },
}
