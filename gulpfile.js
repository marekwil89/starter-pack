'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack');
var browserSync = require('browser-sync').create();
var prefix = require('gulp-autoprefixer');
var gulpif = require('gulp-if');


var proxy = false;

var style = {
	outputStyle: 'compressed', // nested |compact | expanded | compressed
	sourcemap: true
}




gulp.task('sass', function () {
  return gulp.src('src/scss/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: style.outputStyle}).on('error', sass.logError))
	.pipe(prefix({
        browsers: ['last 3 versions']
    }))
	.pipe(gulpif(style.sourcemap, sourcemaps.write()))
	.pipe(gulp.dest('./dist/'));
});


gulp.task('webpack', function(done) {
  webpack({
	entry: './src/main.js',
	output: {
		path: __dirname + '/dist/',
		filename: "boundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
				}
			}
		]
  }
  }, function(error) {
	var pluginError;

	if (error) {
	  pluginError = new gulpUtil.PluginError('webpack', error);

	  if (done) {
		done(pluginError);
	  } else {
		gulpUtil.log('[webpack]', pluginError);
	  }
	  return;
	}

	if (done) {
	  done();
	}
  });
});



gulp.task('serve', function() {
    if( proxy === false ){
	    browserSync.init({
	        server: {
	            baseDir: "./"
	        }
	    });
	}else{
	    browserSync.init({
	        proxy: proxy
	    });
	}

	gulp.watch('./src/scss/**/*.scss', ['sass']).on('change', browserSync.reload);
	gulp.watch('./src/**/*.js', ['webpack']).on('change', browserSync.reload);
	gulp.watch('./**/*.html').on('change', browserSync.reload);
	gulp.watch('./**/*.php').on('change', browserSync.reload);
});


gulp.task('default', ['serve']);