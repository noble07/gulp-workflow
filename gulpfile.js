// "use strict";

// // Load plugins
// const autoprefixer = require("autoprefixer");
// const browsersync = require("browser-sync").create();
// const cp = require("child_process");
// const cssnano = require("cssnano");
// const del = require("del");
// const eslint = require("gulp-eslint");
// const gulp = require("gulp");
// const imagemin = require("gulp-imagemin");
// const newer = require("gulp-newer");
// const plumber = require("gulp-plumber");
// const postcss = require("gulp-postcss");
// const rename = require("gulp-rename");
// const sass = require("gulp-sass");
// const webpack = require("webpack");
// const webpackconfig = require("./webpack.config.js");
// const webpackstream = require("webpack-stream");

// // BrowserSync
// function browserSync(done) {
//   browsersync.init({
//     server: {
//       baseDir: "./_site/"
//     },
//     port: 3000
//   });
//   done();
// }

// // BrowserSync Reload
// function browserSyncReload(done) {
//   browsersync.reload();
//   done();
// }

// // Clean assets
// function clean() {
//   return del(["./_site/assets/"]);
// }

// // Optimize Images
// function images() {
//   return gulp
//     .src("./assets/img/**/*")
//     .pipe(newer("./_site/assets/img"))
//     .pipe(
//       imagemin([
//         imagemin.gifsicle({ interlaced: true }),
//         imagemin.jpegtran({ progressive: true }),
//         imagemin.optipng({ optimizationLevel: 5 }),
//         imagemin.svgo({
//           plugins: [
//             {
//               removeViewBox: false,
//               collapseGroups: true
//             }
//           ]
//         })
//       ])
//     )
//     .pipe(gulp.dest("./_site/assets/img"));
// }

// // CSS task
// function css() {
//   return gulp
//     .src("./assets/scss/**/*.scss")
//     .pipe(plumber())
//     .pipe(sass({ outputStyle: "expanded" }))
//     .pipe(gulp.dest("./_site/assets/css/"))
//     .pipe(rename({ suffix: ".min" }))
//     .pipe(postcss([autoprefixer(), cssnano()]))
//     .pipe(gulp.dest("./_site/assets/css/"))
//     .pipe(browsersync.stream());
// }

// // Lint scripts
// function scriptsLint() {
//   return gulp
//     .src(["./assets/js/**/*", "./gulpfile.js"])
//     .pipe(plumber())
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
// }

// // Transpile, concatenate and minify scripts
// function scripts() {
//   return (
//     gulp
//       .src(["./assets/js/**/*"])
//       .pipe(plumber())
//       .pipe(webpackstream(webpackconfig, webpack))
//       // folder only, filename is specified in webpack config
//       .pipe(gulp.dest("./_site/assets/js/"))
//       .pipe(browsersync.stream())
//   );
// }

// // Jekyll
// function jekyll() {
//   return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
// }

// // Watch files
// function watchFiles() {
//   gulp.watch("./assets/scss/**/*", css);
//   gulp.watch("./assets/js/**/*", gulp.series(scriptsLint, scripts));
//   gulp.watch(
//     [
//       "./_includes/**/*",
//       "./_layouts/**/*",
//       "./_pages/**/*",
//       "./_posts/**/*",
//       "./_projects/**/*"
//     ],
//     gulp.series(jekyll, browserSyncReload)
//   );
//   gulp.watch("./assets/img/**/*", images);
// }

// // define complex tasks
// const js = gulp.series(scriptsLint, scripts);
// const build = gulp.series(clean, gulp.parallel(css, images, jekyll, js));
// const watch = gulp.parallel(watchFiles, browserSync);

// // export tasks
// exports.images = images;
// exports.css = css;
// exports.js = js;
// exports.jekyll = jekyll;
// exports.clean = clean;
// exports.build = build;
// exports.watch = watch;
// exports.default = build;

const gulp = require('gulp');
const sass = require('gulp-sass');
const browsersync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const webpack = require("webpack");
const webpackconfig = require("./webpack.config");
const webpackstream = require("webpack-stream");

gulp.compiler = require('node-sass');

function browserSync(done){
  browsersync.init({
    server: {
      baseDir: './'
    }
  });
  done();
}

function style(){
  return gulp.src([
    'node_modules/bootstrap/scss/bootstrap.scss',
    'src/scss/app.scss'
  ])
  .pipe(sass({outputStyle:'compressed'}))
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(gulp.dest('dist/css'))
  .pipe(browsersync.stream());
};

function scriptsBuild(){
  return (
    gulp
      .src([
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/mustache/mustache.min.js',
        './src/js/main.js'
      ])
      .pipe(webpackstream(webpackconfig, webpack))
      .pipe(gulp.dest('./dist/js'))
      .pipe(browsersync.stream())
  );
}

function watchFiles(){
  gulp.watch('./src/scss/**/*.scss', style);
  gulp.watch('./src/js/**/*', scriptsBuild);
  gulp.watch('./*.html').on('change', browsersync.reload);
  gulp.watch('./src/js/**/*.js').on('change', browsersync.reload);
}

const watch = gulp.parallel(watchFiles, browserSync)

exports.style = style;
exports.watch = watch;
exports.scripts = scriptsBuild;