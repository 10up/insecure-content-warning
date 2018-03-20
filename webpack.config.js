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
			}
		]
	}
};
