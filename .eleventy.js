module.exports = {
    htmlTemplateEngine: "njk"
};

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("svg");
    eleventyConfig.addPassthroughCopy("img");
    eleventyConfig.addPassthroughCopy({
        "./node_modules/bootstrap/dist/js/bootstrap.min.js": "./js/bootstrap.min.js",
        "./node_modules/popper.js/dist/umd/popper.min.js": "./js/popper.min.js",
        "./node_modules/dark-mode-toggle/dist/dark-mode-toggle.min.mjs": "./js/dark-mode-toggle.min.mjs",
      });
  }