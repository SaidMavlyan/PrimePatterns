// Load plugin
var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var del = require('del');
var sass = require('gulp-sass');
var run = require('gulp-run');

// Sync files
gulp.task('sync', function() {
  return run('rsync -av --exclude "node_modules" --exclude "src" ./* /var/www/html/wp-content/themes/nutriPaws/').exec();
})

// Styles
gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 20 versions'], cascade: false }))
    .pipe(gulp.dest('dist/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return  gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(newer('dist/img'))
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/css', 'dist/js', 'dist/img']);
});

// Default task
gulp.task('default', function() {
  gulp.start('sass', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

  // Watch .css files
  gulp.watch('src/scss/**/*.scss', ['sass']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/img/**/*', ['images']);
});

// Watch sass
gulp.task('sass:watch', function () {
  gulp.watch('src/scss/**/*.scss', ['sass']);
});

