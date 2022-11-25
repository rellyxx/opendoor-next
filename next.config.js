/** @type {import('next').NextConfig} */
// const withImages = require('next-images')
// const withLess = require("next-with-less");
const { i18n } = require('./next-i18next.config.js');
module.exports = {
	i18n,
	reactStrictMode: true,
	swcMinify: true,
	webpack: (config) => {
		// config.module.rules.push({
		//   test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
		//   loader: "url-loader",
		//   options: {
		//     limit: 10000,
		//   },
		// });
		return config
	}
}

