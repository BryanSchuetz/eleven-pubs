const { DateTime }  = require('luxon');
const now           = String(Date.now())
const htmlmin       = require("html-minifier")
const yaml          = require("js-yaml")
const toml          = require("toml")

module.exports = function (eleventyConfig) {

  //**Watch Targets**
  
  //tailwind
  eleventyConfig.addWatchTarget('./tailwind.config.js')
  eleventyConfig.addWatchTarget('./src/site/assets/tailwind.css')

  //**Passthroughs**

  //Alpine
  eleventyConfig.addPassthroughCopy({'./node_modules/alpinejs/dist/cdn.js': './assets/js/alpine.js'})
  //Turbo
  eleventyConfig.addPassthroughCopy({'./node_modules/@hotwired/turbo/dist/turbo.es2017-umd.js': './assets/js/turbo.js'})
  //Images
  eleventyConfig.addPassthroughCopy("./src/site/assets/images");

  //**Custom Data Files **

  //Add yaml for global and scoped discrete data files
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  //Add toml for template data configuration
  eleventyConfig.addDataExtension("toml", contents => toml.parse(contents));
  // Layout aliases for convenience
  eleventyConfig.addLayoutAlias('default', '_layouts/base.liquid');

  //**Filters**

  // a debug utility
  eleventyConfig.addFilter('dump', obj => {
    return util.inspect(obj)
  });
  // Grab excerpts and sections from a file
  eleventyConfig.addFilter("section", require("./src/utils/section.js") );
  // Compress and combine js files
  eleventyConfig.addFilter("jsmin", require("./src/utils/minify-js.js") );
  // Date helper for readable date
  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('LLLL d, y');
  });
  //Date helper for abreviated machine date
  eleventyConfig.addFilter('htmlDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('y-MM-dd');
  });
  
  //**Shortcodes**

  //timestamp for cache busting
  eleventyConfig.addShortcode('version', function () {
    return now
  })

  //**Optimizations**

  //minify html

  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith('.html')
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified
    }

    return content
})
  
  //dir settings
  return {
    dir: {
      input: "src/site",
      output: "dist",
      layouts: "_layouts",
      includes: "_includes"
    },
    templateFormats: [ "md", "liquid", "html", ],
  };
};