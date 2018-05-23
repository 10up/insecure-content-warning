const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				exclude: /node_modules/,
				use: [
					{
						loader: 'eslint-loader',
						options: {
							failOnWarning: false,
							failOnError: true
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},

		],
	},
	// Copy over static CSS assets from src to dist.
	plugins: [
		new CopyWebpackPlugin( [ {
			from: 'src/insecure-content-admin.css',
			to: './' // Goes into 'dist' folder
		} ] )
	]
};
