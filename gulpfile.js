const gulp = require('gulp');

// Tasks
require('./gulp/dev.js');
require('./gulp/prod.js');

gulp.task(
	'default',
	gulp.series(
		'clean:dev', 'extract-html', 'remove-container', 'update-js', 'clean-up', 'process-css',
		gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'js:dev'),
		gulp.parallel('server:dev', 'watch:dev')
	)
);

gulp.task(
	'prod',
	gulp.series(
		'clean:prod', 'extract-html', 'remove-container', 'update-js', 'clean-up', 'process-css',
		gulp.parallel('html:prod', 'sass:prod', 'images:prod', 'js:prod'),
		gulp.parallel('server:prod', 'watch:prod')
	)
);
