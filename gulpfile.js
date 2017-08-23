var gulp = require("gulp");
var sass = require("gulp-sass");
var watch = require("gulp-watch");
var autoprefixer = require("gulp-autoprefixer");
var exec = require('child_process').exec;

// main
gulp.task("default", ["watch"]);


// watch folders
gulp.task("watch", function() {
    gulp.watch("./www/scss/**/*.scss", ["scss"]);
    gulp.watch("./www/views/**/*.html", ["html"]);
});


// sass
gulp.task("scss", function () {
    return gulp.src("./www/scss/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["> 5%"],
            cascade: false
        }))
        .pipe(gulp.dest("./www/css"));
});


// combine html files (backbone templates)
gulp.task("html", function () {
    exec('htmlcat --in www/views/app.html --out www/index.html', function(err) {
        if (err) console.log(err);
    });
});


