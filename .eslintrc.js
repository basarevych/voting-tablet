module.exports = {
    "extends": "standard",
    "parserOptions": {
        "ecmaVersion": 2017,
    },
    "env": {
        "node": true,
        "browser": true,
        "jquery": true,
    },
    "rules": {
        "indent": "off",
        "semi": ["error", "always"],
        "curly": ["error", "multi-or-nest", "consistent"],
        "no-multi-spaces": ["error", {"ignoreEOLComments": true}],
        "no-return-await": "off",
        "space-before-function-paren": ["error", {"anonymous": "always", "named": "never"}],
        "comma-dangle": ["off", {"arrays": "ignore", "objects": "ignore", "imports": "ignore", "exports": "ignore", "functions": "never"}],
        "standard/no-callback-literal": "off",
    }
};