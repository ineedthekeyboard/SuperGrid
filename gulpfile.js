var gulp = require('gulp');
var webserver = require('gulp-webserver');
var jsdoc = require('gulp-jsdoc3');
var concat = require('gulp-concat');
var  uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
//************************
// gulp serve - build docs then serve
// gulp build - build all files for distribution
// gulp docs - build all doc and demo files
// gulp commit - refreshes all docs and build files for commit - Alias for build
//************************

//Commit Task
gulp.task('commit',['build']);

//Serve Tasks
gulp.task('serve', ['docs'], function() {
    gulp.src('app')
        .pipe(webserver({
            fallback: 'index.html',
            port: 8080
        }));
    gulp.src('docs')
        .pipe(webserver({
            fallback: 'index.html',
            port: 8081
        }));
});

//************************
//Docs Task
//1) build js docs
//2) build demo
gulp.task('buildDocs', function(cb) {
    let config = require('./jsdoc.json');
    gulp.src(['README.md', 'app/js/supergrid/**/*.js'], {
            read: false
        })
        .pipe(jsdoc(config, cb));
});
gulp.task('buildDemo', function(){
    return gulp.src('app/demo/**/*',{ base: './' })
        .pipe(gulp.dest('docs/demo'));
});
gulp.task('docs',['buildDocs','buildDemo']);
//************************
//Build Distribution Tasks
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
  return gulp.src('app/demo/sample.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('buildstd', ['buildCSS', 'buildSample'], function() {
  return gulp.src(['app/js/supergrid/supergrid.js'])
    .pipe(uglify())
    .pipe(concat('supergrid.min.js'))
    .pipe(gulp.dest('dist'));
});
gulp.task('build',['buildstd', 'buildFullDist', 'docs']);
