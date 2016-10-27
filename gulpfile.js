//noinspection JSUnresolvedFunction
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var liveserver = require('gulp-server-livereload');
var jsdoc = require('gulp-jsdoc3');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
//************************
// gulp serve - build docs then serve
// gulp build - build all files for distribution
// gulp docs - build all doc and demo files
// gulp commit - refreshes all docs and build files for commit - Alias for build
//************************

gulp.task('default', ['build']);
gulp.task('docs', ['buildDocs', 'buildDemo']);
gulp.task('build', ['sass', 'docs', 'buildstd', 'buildFullDist', 'docs']);

//Serve Tasks
gulp.task('serve', ['sass', 'watch'], function () {
    gulp.src('app')
        .pipe(liveserver({
            livereload: {
                enable: true,
                filter: function (filename, cb) {
                    cb(!/\.(sa|le)ss$|node_modules/.test(filename));
                }
            },
            directoryListing: false,
            fallback: 'index.html',
            open: true
        }));
    gulp.src('docs')
        .pipe(webserver({
            fallback: 'index.html',
            port: 8081
        }));
});

gulp.task('watch', function () {
    gulp.watch('./app/sass/**/*.scss', ['sass']);
});

gulp.task('sass', function () {
    return gulp.src('./app/sass/**/*.scss')
               .pipe(sass().on('error', sass.logError))
               .pipe(gulp.dest('./app/css'));
});

//************************
//Docs Task
//1) build js docs
//2) build demo
gulp.task('buildDocs', function (cb) {
    var config = require('./jsdoc.json');
    gulp.src(['README.md', 'app/js/supergrid/**/*.js'], {
        read: false
    })
        .pipe(jsdoc(config, cb));
});
gulp.task('buildDemo', function () {
    gulp.src(['dist/supergrid.min.css', 'dist/supergrid.min.js'], {base: './dist'})
        .pipe(gulp.dest('docs/demo'));
    gulp.src('app/img/hicons.png', {base: './app/img'})
        .pipe(gulp.dest('docs/img'));
    return gulp.src('app/demo/**/*', {base: './app'})
               .pipe(gulp.dest('docs'));
});

//************************
//Build Distribution Task
var rawCss = [
    'app/css/supergrid.css',
    'app/css/supergrid-plain.css'
];
var fullDist = [
    'app/js/vendor/jquery-3.1.0.js',
    'app/js/vendor/jquery-ui-1.12.0-core.js',
    'app/js/supergrid/supergrid.js'
];

//Build a dist with libraries included
gulp.task('buildCSSFullDist', function () {
    //plain css
    gulp.src([
        'app/css/normalize.css',
        'app/css/supergrid-plain.css'
    ])
        .pipe(cssmin())
        .pipe(concat('supergrid-plain.min.css'))
        .pipe(gulp.dest('dist/full'));
    //full css
    return gulp.src([
        'app/css/normalize.css',
        'app/css/supergrid.css'
    ])
               .pipe(cssmin())
               .pipe(concat('supergrid.min.css'))
               .pipe(gulp.dest('dist/full'));
});
gulp.task('buildFullDist', ['buildCSSFullDist'], function () {
    return gulp.src(fullDist)
               .pipe(uglify())
               .pipe(concat('supergrid.min.js'))
               .pipe(gulp.dest('dist/full'));
});

//Standard Supergrid Only Build
gulp.task('buildCSS', function () {
    gulp.src(rawCss)
        .pipe(gulp.dest('dist'));
    gulp.src('app/css/supergrid-plain.css')
        .pipe(cssmin())
        .pipe(concat('supergrid-plain.min.css'))
        .pipe(gulp.dest('dist'));
    return gulp.src('app/css/supergrid.css')
               .pipe(cssmin())
               .pipe(concat('supergrid.min.css'))
               .pipe(gulp.dest('dist'));
});

gulp.task('buildSample', function () {
    return gulp.src('app/demo/sample.html')
               .pipe(gulp.dest('dist'));
});

gulp.task('buildstd', ['buildCSS', 'buildSample'], function () {
    gulp.src(['app/js/supergrid/supergrid.js'])
        .pipe(concat('supergrid.js'))
        .pipe(gulp.dest('dist'));
    return gulp.src(['app/js/supergrid/supergrid.js'])
               .pipe(uglify())
               .pipe(concat('supergrid.min.js'))
               .pipe(gulp.dest('dist'));
});

