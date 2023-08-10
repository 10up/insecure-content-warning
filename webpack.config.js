const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		admin: './src/js/admin.js',
		"classic-editor": './src/js/classic-editor.js',
		"gutenberg": './src/js/gutenberg.js',
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
		],
	},
};