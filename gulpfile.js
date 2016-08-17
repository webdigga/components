// Require gulp modules
var gulp = require('gulp'),

	// Require Sass module
	sass = require('gulp-sass'),

	// Require live reload module
	browserSync = require('browser-sync').create();

// Live reload task
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'library'
		},
	})
})

// Sass task
gulp.task('sass', function() {
	return gulp.src( 'library/styles.scss' )
		.pipe( sass() ) // Converts Sass to CSS with gulp-sass
		.pipe( gulp.dest( 'library' ) )
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Watch task + live reload
gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('library/**/*.scss', ['sass']);
	gulp.watch('library/**/*.html', browserSync.reload); 
	gulp.watch('library/**/*.js', browserSync.reload); 
})
