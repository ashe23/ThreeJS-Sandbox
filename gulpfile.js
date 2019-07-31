var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('build', function () {
    return gulp.src([
        'node_modules/three/build/three.min.js',
        'node_modules/three/examples/js/loaders/*.js',
        'node_modules/three/examples/js/controls/*.js',
        'node_modules/three/examples/js/pmrem/*.js',
        'public/src/*.js',
        'public/main.js'
    ])
        .pipe(gulp.dest('public/build/'));
});

gulp.task('clean', function () {
    return gulp.src('public/build/*.js', { read: false })
        .pipe(clean());
});

gulp.task('watch', function()
{
    return gulp.watch(['public/main.js','public/src/*.js'], gulp.series('clean', 'build'));
});

gulp.task('default', gulp.parallel('build', 'watch'));