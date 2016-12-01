'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var minimist = require('minimist');
var gulpIf = require('gulp-if');
var stripDebug = require('gulp-strip-debug');
var cssmin = require("gulp-cssmin");
var del = require("del");

var options = minimist(process.argv.slice(2)); // コマンドライン・オプション読み込み
var isProduction = options.env == 'production';      // --env=productionと指定されたらリリース用
var parentTaskName = process.argv[2] || 'default';   // 指定されたタスク名
var isWatch = parentTaskName == 'watch';             // watchタスクで起動されたか
console.log('task: ' + parentTaskName);
console.log('is production: ' + isProduction);
console.log('is watch: ' + isWatch);

// js
var jsFiles = [
  'src/js/hoge.js',
  'src/js/fuga.js'
];
gulp.task('js',function(){
  gulp.src(jsFiles)
    .pipe(gulpIf(isWatch,plumber()))        // watchタスクの場合、エラーが発生しても無視
    .pipe(gulpIf(!isProduction,sourcemaps.init())) // 本番以外はソースマップ初期化
    .pipe(concat('all.js')) // Javascriptを結合
    .pipe(gulpIf(isProduction,stripDebug())) // 本番でははconsole.logを除去
    .pipe(uglify())         // all.jsを最小化
    .pipe(rename('all.min.js')) // all-min.jsにリネーム
    .pipe(gulpIf(!isProduction,sourcemaps.write('./'))) // 本番以外はソースマップ出力
    .pipe(gulp.dest('dist/js/'));
});

// css
var cssFiles = [
  'src/css/hoge.css',
  'src/css/fuga.css'
];
gulp.task('css',function(){
  gulp.src(cssFiles)
    .pipe(gulpIf(isWatch,plumber()))        // watchタスクの場合、エラーが発生しても無視
    .pipe(gulpIf(!isProduction,sourcemaps.init())) // 本番以外はソースマップ初期化
    .pipe(concat('all.css'))
    .pipe(cssmin())
    .pipe(rename('all.min.css')) // all-min.jsにリネーム
    .pipe(gulpIf(!isProduction,sourcemaps.write('./'))) // 本番以外はソースマップ出力
    .pipe(gulp.dest('dist/css/'));
});

// html
var htmlFiles = [
  'src/**/*.html'
];
gulp.task('html',function(){
  gulp.src(htmlFiles)
    .pipe(gulp.dest('dist/'));
});

// images
var imageFiles = [
  'src/**/*.png',
  'src/**/*.gif',
  'src/**/*.svg',
];
gulp.task('image',function(){
  gulp.src(imageFiles)
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
  gulp.watch([jsFiles],['js']); // jsFilesのファイルが変更されたら、jsタスクを実行する
  gulp.watch([cssFiles],['css']); // cssFilesのファイルが変更されたら、cssタスクを実行する
  gulp.watch([htmlFiles],['html']); // htmlFilesのファイルが変更されたら、htmlタスクを実行する
  gulp.watch([imageFiles],['image']); // imageFilesのファイルが変更されたら、imageタスクを実行する
});

// デフォルトタスク 今は何もしない
gulp.task('default',function(){
  console.log('Hello Gulp World!');
});

// Clean
gulp.task('clean', function(){
  del(['dist'])
    .then(function(paths){
      console.log('deleted. ' + paths);
    });
});
