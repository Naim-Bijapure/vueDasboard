/** @format */

module.exports = {
	moduleFileExtensions: ["js", "jsx", "json", "vue"],
	transform: {
		"^.+\\.vue$": "vue-jest",
		".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
		"^.+\\.jsx?$": "babel-jest",
		"vee-validate/dist/rules": "babel-jest",
	},

	// transformIgnorePatterns: [
	//   '<roodDir>/node_modules/(?!vee-validate/dist/rules)',
	//   "node_modules",

	//   "<rootDir>/(node_modules)/",

	// ],
	//  new solved issue for vee-validate
	transformIgnorePatterns: ["/node_modules/(?!vee-validate/dist/rules)"],

	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	snapshotSerializers: ["jest-serializer-vue"],
	testMatch: ["**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"],
	testURL: "http://localhost/",
	watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
	// moduleNameMapper: {
	//   "vue": "<rootDir>/node_modules/vue/dist/vue.js"
	// },
};
