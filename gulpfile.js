var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('build', function () {
    return gulp.src([
        'node_modules/three/build/three.min.js',
        'node_modules/three/examples/js/loaders/*.js',
        'node_modules/three/examples/js/controls/*.js',
        'node_modules/three/examples/js/pmrem/*.js',
        'node_modules/three/src/helpers/VertexNormalsHelper.js',
        'node_modules/dat.gui/build/dat.gui.min.js',
        'node_modules/stats.js/build/stats.min.js',
        'public/src/*.js',
        'public/src/Core/*.js',
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
    return gulp.watch(['public/main.js','public/src/*.js', 'public/src/Core/*.js'], gulp.series('clean', 'build'));
});

gulp.task('default', gulp.parallel('build', 'watch'));