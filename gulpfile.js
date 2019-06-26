var gulp = require('gulp');
var plugin = require('gulp-load-plugins')({ lazy: true });

plugin.compiler = require('node-sass');

gulp.task('styles', function(done) {
  return gulp.src('src/scss/app.scss')
  .pipe(plugin.sass().on('error', plugin.sass.logError))
  .pipe(gulp.dest('dist/css'));
  done();
});

gulp.task('serve', gulp.series((['styles']), function() {
  plugin.init();
}))

gulp.task('default', gulp.series((['styles'])));

// var gulp = require('gulp');