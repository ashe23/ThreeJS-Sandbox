var gulp = require('gulp');
var clean = require('gulp-clean');
var del = require('del');

gulp.task('build', function () {
    return gulp.src([
        // 'node_modules/three/build/three.min.js',
        // 'node_modules/three/examples/js/loaders/*.js',
        'node_modules/three/examples/js/renderers/CSS3DRenderer.js',
        'node_modules/three/examples/js/controls/*.js',
        'node_modules/three/examples/js/controls/*.js',
        // 'node_modules/three/examples/js/pmrem/*.js',
        // 'node_modules/three/examples/js/libs/draco/gltf/*.js',
        // 'node_modules/three/examples/js/libs/draco/gltf/*.wasm',
        // 'node_modules/three/src/helpers/VertexNormalsHelper.js',
        // 'node_modules/dat.gui/build/dat.gui.min.js',
        // 'node_modules/stats.js/build/stats.min.js',        
        // 'node_modules/bootstrap/dist/css/bootstrap.min.css',        
        // 'public/src/Core/*.js',
        'public/src/libs/*.js',
        'public/src/scripts/*.js',
        // 'public/main.js'
    ])
        .pipe(gulp.dest('public/build/'));
});

gulp.task('clean', function () {
    return del(['public/build/**']);
    // return gulp.src('public/build/**', { read: false }).pipe(clean());
});

gulp.task('watch', function () {
    return gulp.watch(['public/main.js', 'public/src/*.js', 'public/src/Core/*.js',  'public/src/scripts/*.js'], gulp.series('clean', 'build'));
});

gulp.task('default', gulp.parallel('build', 'watch'));