/*
Using Gulp, SASS and Browser-Sync for your front end web development
http://danielyewright.com/blog/gulp-sass-browser-sync-front-end-dev
*/

/* Needed gulp config */
var gulp = require('gulp');  
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

/* Scripts task */
gulp.task('scripts', function() {
    return gulp.src([
        /* Add your JS files here, they will be combined in this order */
        'assets/js/vendor/jquery-1.11.2.min.js',
        'assets/js/plugins.js',
        'assets/js/global.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

/* Sass task */
gulp.task('sass', function () {  
    gulp.src('assets/scss/main.scss')
    .pipe(plumber())
    .pipe(sass({includePaths: ['assets/scss']}))
    .pipe(gulp.dest('assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('assets/css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

gulp.task('jade', function() {
    return gulp.src('templates/**/*.jade')
        // pipe to jade plugin
        .pipe(jade({
            pretty: true
        }))
        // tell gulp our output folder
        .pipe(gulp.dest('./'));
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
    browserSync.init(['assets/css/*.css', 'assets/js/*.js', 'templates/*.jade'], {
        server: {
            baseDir: './'
        }
    });
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['sass', 'jade', 'browser-sync'], function () {
    /* Watch scss, run the sass task on change. */
    gulp.watch(['assets/scss/*.scss', 'assets/scss/**/*.scss'], ['sass'])
    /* Watch .js files, run the scripts task on change. */
    gulp.watch(['assets/js/*.js'], ['scripts'])
    /* Watch .jade files, run the bs-reload task on change. */
    // gulp.watch(['*.html'], ['bs-reload']);
    gulp.watch(['templates/*.jade'], ['jade', 'bs-reload']);
});