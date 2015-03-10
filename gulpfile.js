var gulp        = require('gulp');
var source      = require('vinyl-source-stream');
var browserify  = require('browserify');
var watchify    = require('watchify');
var reactify    = require('reactify');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var reload      = browserSync.reload;

gulp.task('serve', ['sass'], function() {
  browserSync({
    server: "./"
  });

  gulp.watch("scss/**/*.scss", ['sass']);
  gulp.watch("*.html").on('change', reload);
});

gulp.task('sass', function() {
  return gulp.src("scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("css"))
    .pipe(reload({stream: true}));
});

gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./scripts/app.js'],
        transform: [reactify],
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    });
    var watcher  = watchify(bundler);

    return watcher
    .on('update', function () {
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./build/'))
        .pipe(reload({stream: true}));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('default', ['serve', 'browserify']);
