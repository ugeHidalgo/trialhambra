'use strict';

// Include gulp
var _ = require('lodash'),
    gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint');;

// Develop task with nodemon to relaunch when changes in files.
gulp.task('develop', function(done){
    nodemon({
      script: './server.js',
      env: { 'NODE_ENV': 'development' },
      ignore: ['public/dist/'],
      done: done
    })
});

// Lint JS server side files.
gulp.task('lint', function() {
  var serverJsFiles = [
        'server.js',
        './config/**/*.js',
        './server/**/*.js' ],

      clientJsFiles = [
        //Put client side js files here
      ],
      assets = _.union (
        serverJsFiles,
        clientJsFiles
      )

  return gulp.src(assets)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// Default Task
gulp.task('default', gulp.parallel('develop','lint'));
