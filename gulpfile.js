const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const uglifyjs = require('uglify-es');
const composer = require('gulp-uglify/composer');
const minifyWxss = require('gulp-clean-css');
const pngquant = require('imagemin-pngquant');
const gwcn = require('gulp-wxa-copy-npm');
const minimist = require('minimist');
const minifyJs = composer(uglifyjs, console);
const tsProject = $.typescript.createProject('tsconfig.json');

const pathsConfig = {
  dist: 'dist',
  ts: ['src/**/*.ts'],
  less: ['src/**/*.{less,wxss}'],
  copy: ['src/**/*.{wxml,js,json,png,jpg,jpeg,gif,ico,svg}', 'project.config.json'],
  minify: {
    wxml: ['dist/**/*.wxml'],
    json: ['dist/**/*.json'],
    image: ['dist/**/*.{png,jpg,jpeg,gif,ico,svg}']
  },
};

const knownOptions = {
  string: ['env']
};

const processOptions = minimist(process.argv.slice(2), knownOptions);
const isBuild = processOptions._.indexOf('build') !== -1;
const componentStyleFilePattern = /src\/components\/[a-z-]{1,}\/index/;
const insertComponentCommonStyle = $.insert.transform((contents, file) => {
  if (componentStyleFilePattern.test(file.path)) {
    contents = `@import '../common/styles/index.wxss';${ isBuild ? '' : ' \n '  }${contents}`;
  }
  return contents;
});

console.log('processOptions', processOptions);

function logError(e) {
  console.error(e.message);
  this.emit('end');
}

//清除dist
gulp.task('clean', function () {
  return gulp.src(pathsConfig.dist, { allowEmpty: true }).pipe($.clean());
});

//复制文件（从src到dist）
gulp.task('copy', function () {
  return gulp
    .src(pathsConfig.copy)
    .pipe($.changed(pathsConfig.dist))
    .pipe($.plumber())
    .pipe(gulp.dest(pathsConfig.dist));
});

//编译typescript
gulp.task('compile-ts', function () {
  if (isBuild) {
    const minifyJsOptions = {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    };
    return tsProject
      .src()
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe(tsProject())
      .on('error', logError)
      .js
      .pipe(gwcn())
      .pipe(minifyJs(minifyJsOptions))
      .pipe(gulp.dest(pathsConfig.dist));
  }
  return tsProject
    .src()
    .pipe($.changed(pathsConfig.dist, { extension: '.js' }))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe(tsProject())
    .on('error', logError)
    .js
    .pipe(gwcn())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(pathsConfig.dist));
});

//编译less
gulp.task('compile-less', function () {
  const postcssOptions = [
    autoprefixer({
      overrideBrowserslist: [
        'ios >= 8',
        'android >= 4.1'
      ]
    })
  ];
  if (isBuild) {
    return gulp
      .src(pathsConfig.less)
      .pipe($.less().on('error', logError))
      .pipe($.postcss(postcssOptions))
      .pipe($.rename({ extname: '.wxss' }))
      .pipe(minifyWxss())
      // .pipe(insertComponentCommonStyle)
      .pipe(gulp.dest(pathsConfig.dist));
  }
  return gulp
    .src(pathsConfig.less)
    .pipe($.changed(pathsConfig.dist, { extension: '.wxss' }))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.less().on('error', logError))
    .pipe($.postcss(postcssOptions))
    .pipe($.sourcemaps.write())
    // .pipe(insertComponentCommonStyle)
    .pipe($.rename({ extname: '.wxss' }))
    .pipe(gulp.dest(pathsConfig.dist));
});

//压缩wxml
gulp.task('minify-wxml', function () {
  const options = {
    collapseWhitespace: true,
    removeComments: true,
    keepClosingSlash: true
  };
  return gulp
    .src(pathsConfig.minify.wxml)
    .pipe($.htmlmin(options))
    .pipe(gulp.dest(pathsConfig.dist));
});

//压缩json
gulp.task('minify-json', function () {
  return gulp
    .src(pathsConfig.minify.json)
    .pipe($.jsonminify2())
    .pipe(gulp.dest(pathsConfig.dist));
});

//压缩图片
gulp.task('minify-image', function () {
  const options = {
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [pngquant()]
  };
  return gulp
    .src(pathsConfig.minify.image)
    .pipe($.imagemin(options))
    .pipe(gulp.dest(pathsConfig.dist));
});

//编译
gulp.task('compile', gulp.series('clean', gulp.parallel('compile-ts', 'compile-less', 'copy')));

//监听
gulp.task('watch', gulp.series('compile', function () {
  gulp.watch(pathsConfig.ts, gulp.parallel('compile-ts'));
  gulp.watch(pathsConfig.less, gulp.parallel('compile-less'));
  gulp.watch(pathsConfig.copy, gulp.parallel('copy'));
  $.watch('src/**', function (e) {
    console.log(`[watch]:${e.path} has ${e.event}`);
  });
}));

//构建
gulp.task('build', gulp.series('compile', gulp.parallel('minify-wxml', 'minify-json', 'minify-image')));
