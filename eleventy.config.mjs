export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    './node_modules/bootstrap/dist/css/bootstrap.min.css':
      './css/bootstrap.min.css',
  });
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('img');
}
