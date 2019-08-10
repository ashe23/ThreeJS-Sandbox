var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('build', function () {
    return gulp.src([
        'src/*.js',
        'libs/*.js'
    ])
        .pipe(gulp.dest('public/build/'));
});

gulp.task('clean', function () {
    return gulp.src('public/build/*.js', { read: false })
        .pipe(clean());
});

gulp.task('watch', function () {
    return gulp.watch(['src/*.js'], gulp.series('clean', 'build'));
});

gulp.task('default', gulp.parallel('build', 'watch'));