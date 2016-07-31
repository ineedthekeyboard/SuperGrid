var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('serve', function () {
    gulp.src('app')
        .pipe(webserver({
            fallback: 'index.html',
            port: 8080
        }));
});