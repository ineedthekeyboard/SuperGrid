var gulp = require('gulp');
var webserver = require('gulp-webserver');
var jsdoc = require('gulp-jsdoc3');
var concat = require('gulp-concat');
var  uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');

gulp.task('serve', ['docs'], function () {
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
var fullDistCSS = [
  'app/css/normalize.css',
  'app/css/supergrid.css'
];
var fullDist = [
  'app/js/vendor/jquery-3.1.0.js',
  'app/js/vendor/jquery-ui-1.12.0-core.js',
  'app/js/supergrid/supergrid.js'
];

//Build a dist with libraries included
gulp.task('buildCSSFullDist', function(){
  return gulp.src(fullDistCSS)
    .pipe(cssmin())
    .pipe(concat('supergrid.min.css'))
    .pipe(gulp.dest('dist/full'));
});
gulp.task('buildFullDist', ['buildCSSFullDist'], function(){
  return gulp.src(fullDist)
    .pipe(uglify())
    .pipe(concat('supergrid.min.js'))
    .pipe(gulp.dest('dist/full'));
});

//Standard Supergrid Only Build
gulp.task('buildCSS', function(){
  return gulp.src('app/css/supergrid.css')
    .pipe(cssmin())
    .pipe(concat('supergrid.min.css'))
    .pipe(gulp.dest('dist'));
});
gulp.task('buildSample', function(){
  return gulp.src('app/sample.html')
    .pipe(gulp.dest('dist'));
});
gulp.task('build', ['buildCSS', 'buildSample'], function() {
  return gulp.src(['app/js/supergrid/supergrid.js'])
    .pipe(uglify())
    .pipe(concat('supergrid.min.js'))
    .pipe(gulp.dest('dist'));
});
gulp.task('buildall',['build', 'buildFullDist', 'docs']);
