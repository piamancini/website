var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var precss = require('precss');

gulp.task('watch', () => {
    watch('styles/*.css', batch(function (events, done) {
        gulp.start('build', done);
    }));
});

gulp.task('css', () => {

  var processors = [
    autoprefixer,
    cssnext,
    precss
  ];

  return gulp.src('./styles/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('build', ['css']);