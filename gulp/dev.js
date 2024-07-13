const gulp = require('gulp');

// HTML
const cheerio = require('cheerio');
const fileInclude = require('gulp-file-include');



// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');




const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const path = require('path');
const replace = require('gulp-replace');
const dom = require('gulp-dom');

const htmlmin = require('gulp-htmlmin');
const injectString = require('gulp-inject-string');
const uglify = require('gulp-uglify');

// Images
const imagemin = require('gulp-imagemin');

const paths = {
	htmlInput: 'src/html/preIndex.html',  // входной HTML файл
	htmlOutput: 'src/html/index.html',    // выходной HTML файл
	js: 'src/js/modules/frontendPlugin.js',
	build: 'build/js',                     // директория для сборки JS
};


gulp.task('clean:dev', function (done) {
	if (fs.existsSync('./build/')) {
		return gulp
			.src('./build/', { read: false })
			.pipe(clean({ force: true }));
	}
	done();
});

const fileIncludeSetting = {
	prefix: '@@',
	basepath: '@file',
};

const plumberNotify = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
};

// Задача для извлечения HTML блока и сохранения его в отдельный файл
gulp.task('extract-html', (done) => {
	const htmlContent = fs.readFileSync(paths.htmlInput, 'utf8');
	const $ = cheerio.load(htmlContent);

	const pluginLayout = $('.fbr-plugin-layout');
	const pluginContainer = $('.fbr-plugin-container');

	if (pluginLayout.length > 0 && pluginContainer.length > 0) {
			// Сохраняем содержимое и классы в отдельные файлы
			const layoutHtml = pluginLayout.html();
			const containerHtml = pluginContainer.html();

			fs.writeFileSync('plugin-layout.html', `<div class="fbr-plugin-layout">${layoutHtml}</div>`);
			fs.writeFileSync('plugin-container.html', `<div class="fbr-plugin-container" id="pluginContainer">${containerHtml}</div>`);

		// Копируем preIndex.html в index.html
		fs.copyFileSync(paths.htmlInput, paths.htmlOutput);

		done();
	} else {
		done(new Error('No .fbr-plugin-container found in the HTML file'));
	}
});

// Задача для удаления блока из HTML
gulp.task('remove-container', () => {
	return gulp.src(paths.htmlOutput)
		.pipe(dom(function () {
			this.querySelector('.fbr-plugin-layout').remove();
			this.querySelector('.fbr-plugin-container').remove();
			return this;
		}))
		.pipe(gulp.dest(path.dirname(paths.htmlOutput))); // сохраняем в ту же директорию
});

// Задача для обновления index.js
gulp.task('update-js', () => {
  const pluginLayout = fs.readFileSync('plugin-layout.html', 'utf8').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const pluginContainer = fs.readFileSync('plugin-container.html', 'utf8').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const combinedContent = `${pluginLayout}${pluginContainer}`;

  return gulp.src(paths.js)
    .pipe(replace(/fbrContainer\.innerHTML = `[^`]*`;/s, `fbrContainer.innerHTML = \`${combinedContent}\`;`))
    .pipe(gulp.dest('src/js/modules'));
});

// Удаление файла с html блоком
gulp.task('clean-up', (done) => {
	fs.unlinkSync('plugin-layout.html');
	fs.unlinkSync('plugin-container.html');
	done();
});


gulp.task('html:dev', function () {
	return (
		gulp
			.src(['./src/html/**/*.html', '!./src/html/blocks/*.html', '!./src/html/preIndex.html'])
			.pipe(changed('./build/', { hasChanged: changed.compareContents }))
			.pipe(plumber(plumberNotify('HTML')))
			.pipe(fileInclude(fileIncludeSetting))
			.pipe(gulp.dest('./build/'))
	);
});

// Задача для компиляции SCSS файлов для плагина
gulp.task('sass-plugin', function () {
	return gulp
		.src('./src/scss-fbr-plugin/*.scss')
		.pipe(plumber(plumberNotify('SCSS')))
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('./src/scss-fbr-plugin/'))
});

//   Задача для обновления index.js с CSS содержимым
gulp.task('update-js-css', function (done) {
	const cssContent = fs.readFileSync('./src/scss-fbr-plugin/main.css', 'utf8');
	gulp
		.src(paths.js)
		.pipe(replace(/const css = `[\s\S]*?`;/, `const css = \`${cssContent}\`;`))
		.pipe(gulp.dest('src/js/modules'))
		.on('end', done);
});

// Удаление файла с html блоком
gulp.task('clean-up-css', (done) => {
	fs.unlinkSync('./src/scss-fbr-plugin/main.css');
	done();
});

// Объединенная задача для компиляции SCSS и обновления JS
gulp.task('process-css', gulp.series('sass-plugin', 'update-js-css', 'clean-up-css'));

// Задача для компиляции SCSS файлов для сайта
gulp.task('sass:dev', function () {
	return (
		gulp
			.src('./src/scss/*.scss')
			.pipe(changed('./build/css/'))
			.pipe(plumber(plumberNotify('SCSS')))
			.pipe(sourceMaps.init())
			.pipe(sassGlob())
			.pipe(sass())
			.pipe(sourceMaps.write())
			.pipe(gulp.dest('./build/css/'))
	);
});

gulp.task('images:dev', function () {
	return gulp
		.src('./src/img/**/*')
		.pipe(changed('./build/img/'))
		// .pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest('./build/img/'));
});

// gulp.task('fonts:dev', function () {
// 	return gulp
// 		.src('./src/fonts/**/*')
// 		.pipe(changed('./build/fonts/'))
// 		.pipe(gulp.dest('./build/fonts/'));
// });

// gulp.task('files:dev', function () {
// 	return gulp
// 		.src('./src/files/**/*')
// 		.pipe(changed('./build/files/'))
// 		.pipe(gulp.dest('./build/files/'));
// });

gulp.task('js:dev', function () {
	return gulp
		.src('./src/js/*.js')
		.pipe(changed('./build/js/'))
		.pipe(plumber(plumberNotify('JS')))
		.pipe(babel({
			presets: ["@babel/preset-env"],
			plugins: ["transform-remove-console"]
	}))
		.pipe(webpack(require('./../webpack.configDev.js')))
		.pipe(gulp.dest('./build/js/'));
});

const serverOptions = {
	livereload: {
		enable: true,
		port: 35730 // Измените порт livereload здесь
	},
	open: true,
  port: 8080
};

gulp.task('server:dev', function () {
	return gulp.src('./build/').pipe(server(serverOptions));
});

// Объединенная задача для обработки HTML
gulp.task('html-process', gulp.series('extract-html', 'remove-container', 'update-js', 'clean-up'));

// Задача для отслеживания изменений
gulp.task('watch:dev', function () {
	gulp.watch('./src/html/preIndex.html', gulp.series('html-process')); // Обработка HTML при изменении исходного файла
	gulp.watch('./src/scss-fbr-plugin/**/*.scss', gulp.series('process-css'));
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
	gulp.watch(['./src/html/**/*.html', '!./src/html/preIndex.html'], gulp.parallel('html:dev')); // Обработка всех HTML файлов кроме preIndex.html
	gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
	// gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
	// gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
	gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});

// Задача по умолчанию
gulp.task('default', gulp.series('html-process', 'process-css', 'watch:dev'));

