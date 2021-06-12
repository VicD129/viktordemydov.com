module.exports = {
  htmlTemplateEngine: "njk"
};

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "./node_modules/bootstrap/dist/css/bootstrap.min.css": "./css/bootstrap.min.css",
  });
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("svg");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy({
    "./node_modules/bootstrap/dist/js/bootstrap.min.js": "./js/bootstrap.min.js",
    "./node_modules/popper.js/dist/umd/popper.min.js": "./js/popper.min.js",
  });
}