var gulp = require('gulp');
var webserver = require('gulp-webserver');
var jsdoc = require('gulp-jsdoc3');
var concat = require('gulp-concat');
var  uglify = require('gulp-uglify');

gulp.task('serve',['docs'], function () {
    gulp.src('app')
        .pipe(webserver({
            fallback: 'index.html',
            port: 8080
        }));
    gulp.src('docs/gen')
      .pipe(webserver({
          fallback: 'index.html',
          port: 8081
      }));
});

gulp.task('docs', function (cb) {
    gulp.src(['README.md', 'app/js/supergrid/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});

//Build Simple JS File for external use:
var files = [
  'app/js/supergrid/**/*.js'
];

gulp.task('build', function() {
  return gulp.src(files)
    .pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('dist'));
});
