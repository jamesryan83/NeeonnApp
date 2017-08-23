"use strict";

var app = app || {};
app.utilAndroid = {};


// resize canvas to fit div
app.utilAndroid.fitCanvasToContainer = function (canvasEl, containerEl) {
    var canvasTemp = document.getElementById(canvasEl);
    var ctx = canvasTemp.getContext("2d");

    ctx.canvas.width = $("#" + containerEl)[0].clientWidth;
    ctx.canvas.height = $("#" + containerEl)[0].clientHeight;
}


// Start camera to take a photo.  Returns file uri
app.utilAndroid.takePhoto = function (callback) {
    var options = {
        allowEdit: false,
        quality: 50,
        targetWidth: 1024,
        targetHeight: 1024
        //correctOrientation: true
    }

    navigator.camera.getPicture(callback, function (err) {
        alert("Error: " + err);
    }, options);
}


// Select photo from gallery.  Returns file uri
app.utilAndroid.selectPhoto = function (width, callback) {
    var options = {
        allowEdit: false,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: width,
        targetHeight: 1024
        //correctOrientation: true
    }

    navigator.camera.getPicture(function (nativePath) {
        window.FilePath.resolveNativePath(nativePath, function (path) {
            callback(true, path);
        }, function (code, message) {
            callback(false, code + ", " + message);
        })
    }, function (err) {
        console.log(err);
    }, options);
}

