// serve serves files from the /dist directory

var gulp = require('gulp'),
  config = require('../config'),
  livereload = require('gulp-livereload'),
  server = require('gulp-develop-server');

// run server
gulp.task('serve', function() {
  server.listen({ path: './app.js' }, livereload.listen);
});
