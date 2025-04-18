/** @type {import('postcss-load-config').Config} */
module.exports = {
	plugins: {
		'@tailwindcss/postcss': {},
		autoprefixer: {},
		...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
	},
};