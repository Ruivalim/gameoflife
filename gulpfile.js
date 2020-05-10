const { src, dest, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');

function build(cb){
    return src('src/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('dist/'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('dist/'))
        .pipe(dest('example/'));
}

exports.build = build
exports.watch = function(){
    watch("src/gameoflife.js", build);
}