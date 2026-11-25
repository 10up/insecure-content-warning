/**
 * ESLint flat config. Extends the `@wordpress/scripts` default config.
 */

/**
 * WordPress dependencies
 */
import defaultConfig from '@wordpress/scripts/config/eslint.config.cjs';

export default [
	{
		ignores: [
			'build/**',
			'node_modules/**',
			'vendor/**',
			'src/js/vendor/**',
			'src/js/admin/vendor/**',
			'src/js/frontend/vendor/**',
			'src/js/shared/vendor/**',
		],
	},
	...defaultConfig,
	{
		languageOptions: {
			globals: {
				jQuery: 'readonly',
				tinyMCE: 'readonly',
				insecureContentAdmin: 'readonly',
			},
		},
		settings: {
			'import/core-modules': [
				'@wordpress/api-fetch',
				'@wordpress/api-request',
				'@wordpress/blob',
				'@wordpress/block-editor',
				'@wordpress/blocks',
				'@wordpress/components',
				'@wordpress/compose',
				'@wordpress/data',
				'@wordpress/date',
				'@wordpress/dom-ready',
				'@wordpress/dom',
				'@wordpress/edit-post',
				'@wordpress/editor',
				'@wordpress/element',
				'@wordpress/hooks',
				'@wordpress/i18n',
				'@wordpress/keyboard-shortcuts',
				'@wordpress/keycodes',
				'@wordpress/plugins',
				'@wordpress/primitives',
				'@wordpress/rich-text',
			],
		},
	},
];
