const gulp = require('gulp'),
    sass = require('gulp-sass')(require('node-sass')),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq = require('gulp-group-css-media-queries'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    gulpReplace = require('gulp-replace'),
    notify = require('gulp-notify'),
    del = require('del'),
    fs = require('fs'),
    svgSprite = require('gulp-svg-sprite');

const dist_path = '.',
    cssPref = 'l-';

// modules
const modulesOn = [
    'common-js',
    'common-js/animate',
    'common-js/template',
    'common-js/image',
    'header',
    // 'header/user',
    'header/menu',
    // 'header/lang',
    // 'fsscroll',
    // 'screens',
    // 'screens2',
    // 'scrollsmooth',
    'toggle',
    // 'flex-image',
    // 'cover-image',
    'lazy-load',
    // 'video',
    'popup',
    'popup/media', // popup media video needs video module
    'form/validate',
    'form/checkbox',
    'form/radio',
    'form/select',
    'form/slider',
    'form/autocomplete',
    'form/file',
    'form/placeholder',
    'form/maskinput',
    'form/fieldset',
    'form/number',
    'form',
    'accord',
    // 'ajax',
    // 'more',
    // 'tab',
    // 'alert',
    // 'tooltip',
    'anchor',
    // 'diagram',
    'numberspin',
    // 'share',
    // 'timer',
    'footer',
    // 'getcontentajax',
    // 'animation',
    // 'frames-animate',
    // 'webgl',
    // 'mouseparallax',
    // 'scrollbox',
    // 'floatslider',
    'slickslider',
    // 'zoom',
    // 'cursor',
    // 'spa',
    // 'drag-n-drop',
    'fix-on-scroll'
];

const firstModules = [
    'common-js',
    'common-js/image',
    'header',
    'header/user',
    'header/menu',
    'header/lang',
];

// include libs
const assets = {
    slickslider: ['src/assets/slick.min.js'],
    screens: ['src/assets/jquery.touchSwipe.min.js']
};

let jsAssets = ['src/assets/jquery-3.1.1.min.js'];

modulesOn.forEach(function (val) {
    if (assets[val]) {
        jsAssets = jsAssets.concat(assets[val]);
    }
});

const srcFilter = function (ext, isFirst) {
    const res = modulesOn.filter(itemOn => {
        let ret = false;

        for (const fstItem of firstModules) {
            if (fstItem == itemOn) {
                ret = true;
                break;
            }
        }

        return isFirst ? ret : !ret;
    });

    const src = res.map(m => {
        const spl = m.split('/');
        return 'src/modules/' + m + '/' + spl[spl.length - 1] + '.' + ext;
    });

    return src.filter(path => fs.existsSync(path));
}

const firstCssSrc = ['src/sass/reset.scss', 'variables', 'functions', 'extends', 'mixins', 'src/sass/base.scss', 'src/sass/button.scss', 'src/sass/icon.scss', 'src/sass/grid.scss'].concat(srcFilter('scss', true), 'src/sass/styleHead.scss');

const secondCssSrc = ['variables', 'functions', 'extends', 'mixins'].concat(srcFilter('scss'), 'src/sass/stylesFoot.scss', 'src/sass/sprite.scss', 'src/sass/decor.scss', 'src/sass/class.scss');

const firstJsSrc = srcFilter('js', true);
const secondJsSrc = srcFilter('js');

// DEV MODE
// copy module folders
gulp.task('copy_modules', function () {
    return gulp.src(['src/modules/**/*'], { base: 'src/modules/' })
        .pipe(gulp.dest('src/modules-set/'));
});

gulp.task('clean_modules_folder', function () {
    return del(['src/modules/*']);
});

gulp.task('include_modules', function (done) {
    if (!modulesOn.length) {
        done();
    } else {
        return gulp.src(modulesOn.map((m) => 'src/modules-set/' + m + '/*.*'), { base: 'src/modules-set/' })
            .pipe(gulp.dest('src/modules/'));
    }
});

gulp.task('clean_js_folder', function () {
    return del([dist_path + '/js/*']);
});

gulp.task('dev', gulp.series('copy_modules', 'clean_modules_folder', 'include_modules', 'clean_js_folder', function (done) {
    // html dev
    // HTML(['src/html/**/*.*', '!src/html/**/_*.html']);

    // build scss
    const firstCssCode = firstCssSrc.map(src => '@import "' + src + '"').join('; ');

    fs.writeFile('src/sass/common-fst.scss', firstCssCode, function () {
        CSS();
    });

    const secondCssCode = secondCssSrc.map(src => '@import "' + src + '"').join('; ');

    fs.writeFile('src/sass/common-sec.scss', secondCssCode, function () {
        CSS();
    });

    // build script.js
    JS(true, firstJsSrc);
    JS(false, secondJsSrc);

    // copy common script
    gulp.src('src/js/*.js')
        .pipe(gulp.dest(dist_path + '/js'));

    // import js assets
    if (jsAssets.length) {
        gulp.src(jsAssets)
            .pipe(gulp.dest(dist_path + '/js'));
    }

    // watch css
    gulp.watch(
        ['src/sass/*.scss'].concat(modulesOn.map((m) => 'src/modules/' + m + '/*.scss')),
        gulp.series(function (done) {
            CSS();
            done();
        })
    );

    // watch js
    if (modulesOn.length) {
        gulp.watch(modulesOn.map((m) => 'src/modules/' + m + '/*.js'), gulp.series(function (done) {
            JS(true, firstJsSrc);
            JS(false, secondJsSrc);
            done();
        }));
    }

    gulp.watch('src/js/*.js', gulp.series(function (done) {
        gulp.src('src/js/*.js')
            .pipe(gulp.dest(dist_path + '/js'));
        done();
    }));

    // watch html
    // const htmlWatcher = gulp.watch(['src/html/**/*.*', '!src/html/**/_*.html']);

    // htmlWatcher.on('change', function (path) {
    //     return HTML([path, '!src/html/**/_*.html']);
    // });

    // gulp.watch(['src/html/**/_*.html'].concat(modulesOn.map((m) => 'src/modules/' + m + '/*.html')), gulp.series(function (done) {
    //     HTML(['src/html/**/*.*', '!src/html/**/_*.html']);
    //     done();
    // }));

    done();
}));

// svg sprite
gulp.task('build_image_sprite', function () {
    return gulp.src('src/images/svg/image/*.svg')
        .pipe(svgSprite({
            shape: {
                dimension: {
                    maxWidth: 256,
                    maxHeight: 256
                },
                spacing: {
                    padding: 2
                }
            },
            mode: {
                view: {
                    bust: false,
                    sprite: '../' + dist_path + '/images/sprite.svg',
                    prefix: '%%svg-%s',
                    render: {
                        scss: { dest: '../src/sass/_sprite-extends.scss' }
                    }
                }
            }
        }))
        .pipe(gulpReplace(dist_path + '/', ''))
        .pipe(gulp.dest('.'));
});

gulp.task('build_symbol_sprite', function () {
    return gulp.src('src/images/svg/symbol/*.svg')
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../images/sprite-symbol.svg',
                }
            }
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('svgs', gulp.series('build_image_sprite', 'build_symbol_sprite', function (done) {
    gulp.src('src/images/*.svg')
        .pipe(gulpReplace(/(fill|stroke|fill-opacity)=".*?"/g, ''))
        .pipe(gulpReplace('<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', ''))
        .pipe(gulp.dest('src/images'));

    done();
}));

// DISTRIBUTION STYLES and SCRIPTS
gulp.task('ssd', function (done) {
    CSS(true);

    JS(true, firstJsSrc, true);
    JS(false, secondJsSrc, true);

    gulp.src('src/js/*.js')
        .pipe(babel())
        .on('error', notify.onError(function (err) { return err; }))
        .pipe(gulpReplace('@version@', Date.now()))
        .pipe(gulp.dest(dist_path + '/js'));

    done();
});

// DISTRIBUTION ALL
gulp.task('dist', function (done) {
    // HTML(['src/html/**/*.*', '!src/html/**/_*.*'], true);

    CSS(true);

    JS(true, firstJsSrc, true);
    JS(false, secondJsSrc, true);

    gulp.src('src/js/*.js')
        .pipe(babel())
        .on('error', notify.onError(function (err) { return err; }))
        .pipe(gulpReplace('@version@', Date.now()))
        .pipe(gulp.dest(dist_path + '/js'));

    done();
});

// Functions
// css
function CSS(dist) {
    setTimeout(function () {
        if (dist) {
            del([dist_path + '/css/*.css.map']);

            gulp.src('src/sass/common-fst.scss')
                .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
                .pipe(autoprefixer())
                // .pipe(gulpReplace(/(?<!url.*)\.([a-z])/gi, '.' + cssPref + '$1'))
                .pipe(gcmq())
                .pipe(cleanCSS({ format: 'keep-breaks' }))
                .pipe(rename('style.head.css'))
                .pipe(gulp.dest(dist_path + '/css'));

            gulp.src('src/sass/common-sec.scss')
                .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
                .pipe(autoprefixer())
                // .pipe(gulpReplace(/(?<!url.*)\.([a-z])/gi, '.' + cssPref + '$1'))
                .pipe(gcmq())
                .pipe(cleanCSS({ format: 'keep-breaks' }))
                .pipe(rename('style.foot.css'))
                .pipe(gulp.dest(dist_path + '/css'));

        } else {
            gulp.src('src/sass/common-fst.scss')
                .pipe(sourcemaps.init())
                .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
                .pipe(rename('style.head.css'))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(dist_path + '/css'));

            gulp.src('src/sass/common-sec.scss')
                .pipe(sourcemaps.init())
                .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
                .pipe(rename('style.foot.css'))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(dist_path + '/css'));
        }
    }, 321);
}

// javascript
function JS(isFirst, src, dist) {
    if (!src.length) return;

    if (dist) {
        del([dist_path + '/js/*.js.map']);

        gulp.src(src)
            .pipe(babel())
            .on('error', notify.onError(function (err) { return err; }))
            .pipe(concat(isFirst ? 'script.head.js' : 'script.defer.js'))
            .pipe(gulp.dest(dist_path + '/js'));
    } else {
        gulp.src(src)
            .pipe(sourcemaps.init())
            .pipe(concat(isFirst ? 'script.head.js' : 'script.defer.js'))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dist_path + '/js'));
    }
}

// html
// function HTML(src, dist) {
//     if (dist) {
//         return gulp.src(src, { base: 'src/html/' })
//             .pipe(fileinclude())
//             .on('error', notify.onError(function (err) { return err; }))
//             // .pipe(gulpReplace(/class="([\w\s-]+)"/gi, function (match, p1, offset, string) {
//             //     return 'class="' + p1.replace(/([\w-]+)/gi, cssPref + '$1') + '"';
//             // }))
//             .pipe(gulpReplace('@version@', Date.now()))
//             .pipe(gulp.dest(dist_path))
//             .pipe(notify({
//                 title: 'HTML',
//                 message: 'Dist HTML'
//             }));
//     } else {
//         return gulp.src(src, { base: 'src/html/' })
//             .pipe(fileinclude())
//             .on('error', notify.onError(function (err) { return err; }))
//             .pipe(gulpReplace('@version@', Date.now()))
//             .pipe(gulp.dest(dist_path))
//             .pipe(notify({
//                 onLast: true,
//                 title: 'HTML',
//                 message: 'HTML has been Compiled!'
//             }));
//     }
// }