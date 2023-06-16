module.exports = {
	env: { jquery: true },
	extends: ['@10up/eslint-config/wordpress'],
	settings: {
		'import/core-modules': [ 'jquery' ]
	},
	rules: {
		'react/no-array-index-key': 'off',
		'jsdoc/newline-after-description': 'off',
		"react/jsx-indent" : ["error", 0],
		"react/jsx-indent-props" : ["error", 0],
	},
	globals: {
		module: true,
		process: true,
		wp: true,
		jquery: true,
		tinyMCE: true,
		insecureContentAdmin: true,
	},
};
