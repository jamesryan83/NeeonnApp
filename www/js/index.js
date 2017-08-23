"use strict";

var app = app || {};
app.events = {};

// Initialize
app.initialize = function() {
    document.addEventListener("deviceready", app.onDeviceReady, false);
}


// Device Ready
app.onDeviceReady = function() {
    console.log("Device Ready");

    _.extend(app.events, Backbone.Events);

    // Setup router
    app.router = new app.Router();
    Backbone.history.start();

    // app events
    document.addEventListener("pause", app.onPause, false);
    document.addEventListener("resume", app.onResume, false);
    document.addEventListener("backbutton", app.onBack, false);
    document.addEventListener("touchstart", app.touchStarted, false);
    document.addEventListener("touchend", app.touchEnded, false);


    // Create required folders
    app.fileFolder.startupSetup(function (success) {
        if (success === false) {
            alert("Error creating required app folders");
        }
    });

}



// On Pause
app.onPause = function () {
    console.log("onPause Called");
}


// On Resume
app.onResume = function () {
    // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html#android-quirks
    console.log("onResume Called");
}


// On Back
app.onBack = function () {
    app.router.back();
}







app.touchStartTime;
app.touchStartTimeout;

// Touch Start
app.touchStarted = function (e) {
    if ($(e.target).hasClass("longClickable")) {
        app.touchStartTime = new Date().getTime();
        app.touchStartTimeout = setTimeout(function () {
            app.util.showToast($(e.target).attr("title"));
        }, 800);
    }
}

// Touch End
app.touchEnded = function (e) {
    var touchTime = new Date().getTime() - app.touchStartTime;
    if (touchTime < 800) {
        window.clearTimeout(app.touchStartTimeout);
    }
}



// Start app
app.initialize();
