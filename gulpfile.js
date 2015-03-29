var gulp = require('gulp'),
    fs = require('fs'),
    replace = require('gulp-replace'),
    paths = {
        script: './src/datepicker.js',
        template: './src/template.html',
        build: './dist/',
        styles: './src/datepicker.css'
    };


gulp.task('default', ['script-datepicker', 'styles-datepicker'], function() {
    gulp.watch(paths.script, ['script-datepicker']);
    gulp.watch(paths.styles, ['styles-datepicker']);
});

gulp.task('script-datepicker', function(){
    var template = fs.readFileSync(paths.template, { encoding: 'UTF-8' })
        .replace(/\r?\n|\r/g, '')
        .replace(/\s\s/g, '');

    gulp.src(paths.script)
        .pipe(replace(/%%TEMPLATE%%/g, '\'' + template + '\''))
        .pipe(gulp.dest(paths.build));
});

gulp.task('styles-datepicker', function(){
    gulp.src(paths.styles)
        .pipe(gulp.dest(paths.build));
})
