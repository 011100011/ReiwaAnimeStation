const mix = require("laravel-mix");
const tailwindcss = require("tailwindcss");

mix
  .js("resources/js/app.js", "public/js/app.js")
  .sass("resources/scss/app.scss", "public/css/app.css")
  .options({
    processCssUrls: false,
    postCss: [tailwindcss("./tailwind.config.js")],
  });
