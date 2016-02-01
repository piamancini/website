var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var precss = require('precss');
var less = require('gulp-less');

gulp.task('watch', () => {
    watch('styles/*.css', batch(function (events, done) {
        gulp.start('css', done);
    }));
    watch('styles/less/*.less', batch(function (events, done) {
        gulp.start('less', done);
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

gulp.task('less', () => {
    return gulp.src('./styles/less/*.less')
      .pipe(less())
      .pipe(gulp.dest('./public/css'));
});

gulp.task('build', ['css','less']);