var gulp = require('gulp'),
		sass = require('gulp-sass'),
		browserSync = require('browser-sync'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		sourcemaps = require('gulp-sourcemaps'),
		gutil = require('gulp-util'),
		babelify = require('babelify'),
		autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  gulp.src('src/sass/style.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('build', function () {
  var b = browserify({
    entries: 'src/js/main.js',
    debug: true
  })
  .transform(babelify.configure({
    presets: ["es2015"]
  }));
  
  return b.bundle()
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .on('error', gutil.log)
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/js'));
});

gulp.task('build-reload', ['build'], function() {
  return browserSync.reload();
});

gulp.task('html', function() {
  return browserSync.reload();
});

gulp.task('watch', function() {
  gulp.watch(['./src/sass/**/*.scss'], ['sass']);
  gulp.watch('./src/js/**/*.js', ['build-reload']);
  gulp.watch('./**/*.html', ['html']);
});

gulp.task('serve', ['sass', 'build-reload'], function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('default', ['serve', 'watch', 'sass', 'build-reload']);