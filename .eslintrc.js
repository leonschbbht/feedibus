module.exports = {
    env: {
        node: true,
        browser: true,
        es6: true
    },
    extends: [
        'standard',
        'eslint:recommended',
        'plugin:vue/base',
        'plugin:vue/essential',
        'plugin:vue/vue3-recommended'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parser: 'vue-eslint-parser',
    plugins: [
        'vue'
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.vue']
            }
        }
    },
    rules: {
        indent: ['error', 4],
        semi: 'off',
        yoda: 'off'
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                'vue/component-tags-order': 'off', // Will gelegentlich <script> vor <template>
                'vue/html-indent': [
                    'error', 4, {
                        attribute: 1,
                        baseIndent: 1,
                        closeBracket: 0,
                        alignAttributesVertically: true
                    }],
                'vue/no-deprecated-v-bind-sync': 'off'
            }
        }
    ],
    ignorePatterns: ['public/js/**', 'node_modules/**']
};
