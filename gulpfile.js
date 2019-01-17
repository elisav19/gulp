const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const postcss = require('gulp-postcss');
const  sourcemaps = require('gulp-sourcemaps');
const log = require('fancy-log');
const browserSync = require('browser-sync');

const sassSourceFile = 'dev/scss/**/*.scss';
const outputFolder = 'dist/css';
const watchedResources = 'dev/scss/**/*';

gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    notify: false
  });
});

gulp.task('scss', function (done) {
  gulp.src(sassSourceFile)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', function(err){
    log.error(err.message);
    }))
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outputFolder))
    .on('end', done)
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('watch',
  gulp.series('scss', function (done) {
    gulp.watch('dist/*.html', browserSync.reload),
    gulp.watch(watchedResources, gulp.parallel('scss')); done();
  },
    gulp.parallel('browser-sync'))
);

gulp.task('default', gulp.series(
  gulp.parallel('watch', function () {})
)
);
