module.exports = {
    htmlTemplateEngine: "njk"
};

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("svg");
    eleventyConfig.addPassthroughCopy("img");
  }