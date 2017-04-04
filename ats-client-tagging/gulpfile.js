'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  runSequence = require('run-sequence'),
  uglify = require('gulp-uglify'),
  //replace = require('gulp-replace'),
  //karma = require('karma').server,
  pkg = require('./package.json'),
  outputFilenames = {
    full: 'stcats.js',
    min: 'stcats.min.js'
  };

gulp.task('jshint', function () {
  return gulp.src(['./src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('build', function () {
  var destDir = './dist/';

  function browserifyOutput() {
    for (var prop in outputFilenames) {
      var b = browserify(pkg.main)
        .bundle()
        .pipe(source(outputFilenames[prop]))
        .pipe(buffer());

      if (prop === 'min') {
        b = b.pipe(uglify());
      }

      b.pipe(gulp.dest(destDir));
    }
  }

  return browserifyOutput();
});

gulp.task('default', function() {
  runSequence('jshint', 'build');
});
