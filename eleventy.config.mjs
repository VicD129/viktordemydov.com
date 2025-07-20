export default function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy('fonts');
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('img');
  eleventyConfig.addPassthroughCopy('manifest.json');
  eleventyConfig.addPassthroughCopy('sw.js');
  eleventyConfig.addPassthroughCopy('*.png');
  eleventyConfig.addPassthroughCopy('*.ico');
  eleventyConfig.addPassthroughCopy('*.xml');

  // Watch for changes in CSS and rebuild
  eleventyConfig.addWatchTarget('./css/');

  // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site'
    },
    // Use liquid templating engine
    templateFormats: ['html', 'md', 'njk', 'liquid'],
    htmlTemplateEngine: 'liquid',
    markdownTemplateEngine: 'liquid'
  };
}
