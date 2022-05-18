const { DateTime } = require("luxon");
const now = String(Date.now());
const htmlmin = require("html-minifier");
const yaml = require("js-yaml");
const toml = require("toml");

/* Debugging Filter */
const dumpFilter = require("@jamshop/eleventy-filter-dump");
/* Calculating Read Time */
const timeToRead = require('eleventy-plugin-time-to-read');

module.exports = function (eleventyConfig) {
  //**Plugins**
  eleventyConfig.addPlugin(timeToRead, {
    style: 'short'
  });
  
  //**Watch Targets**

  //tailwind
  eleventyConfig.addWatchTarget("./tailwind.config.js");
  eleventyConfig.addWatchTarget("./src/site/assets/tailwind.css");

  //**Passthroughs**

  //Legacy CSS
  eleventyConfig.addPassthroughCopy({
    "./src/site/assets/css/legacy.css": "./assets/css/legacy.css",
  }); 

  //Alpine
  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.js": "./assets/js/alpine.js",
  });
  //Turbo
  eleventyConfig.addPassthroughCopy({
    "./node_modules/@hotwired/turbo/dist/turbo.es2017-umd.js":
      "./assets/js/turbo.js",
  });
  //Images
  eleventyConfig.addPassthroughCopy("./src/site/assets/images");

  //**Custom Data Files **

  //Add yaml for global and scoped discrete data files
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  //Add toml for template data configuration
  eleventyConfig.addDataExtension("toml", (contents) => toml.parse(contents));
  // Layout aliases for convenience
  eleventyConfig.addLayoutAlias("base", "_layouts/base.liquid");

  //**Filters**
  //Array items include string
  eleventyConfig.addFilter("pluck", function (arr, value) {
    return arr.filter((item) => item.includes(value));
  });
  //Array items do not include string
  eleventyConfig.addFilter("pluckNot", function (arr, value) {
    return arr.filter((item) => !item.includes(value));
  });
  // a debug utility
  eleventyConfig.addFilter("dump", dumpFilter);
  // Grab excerpts and sections from a file
  eleventyConfig.addFilter("section", require("./src/utils/section.js"));
  // Compress and combine js files
  eleventyConfig.addFilter("jsmin", require("./src/utils/minify-js.js"));
  
  // Date helper for readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("LLLL d, y");
  });

  //Relative date helper
  eleventyConfig.addFilter("relativeDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toRelative({unit: "days"});
  });

  //**Shortcodes**

  //timestamp for cache busting
  eleventyConfig.addShortcode("version", function () {
    return now;
  });

  //**Custom Collections **/
   eleventyConfig.addCollection("featuredPosts", function(collectionApi) {
    return collectionApi.getFilteredByTag("hash-featured");
  });
  eleventyConfig.addCollection("justPosts", function(collectionApi) {
    return collectionApi.getFilteredByTag("hash-post").sort(function(a,b){
      return b.date - a.date
    });
  });
  //**Optimizations**

  //minify html

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  //dir settings
  return {
    dir: {
      data: "_data",
      input: "src/site",
      output: "dist",
      layouts: "_layouts",
      includes: "_includes",
    },
    templateFormats: ["md", "liquid", "html"],
  };
};
