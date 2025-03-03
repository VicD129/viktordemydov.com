export default function (eleventyConfig) {
  // Remove Bootstrap passthrough
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('img');
}
