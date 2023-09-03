const NotionRenderer = require("./_includes/notion");

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy("style.css");
	eleventyConfig.addShortcode("notion", (blocks) => NotionRenderer(blocks));

	return {
		// Opt-out of pre-processing global data JSON files: (default: `liquid`)
		dataTemplateEngine: false,
	};
};
