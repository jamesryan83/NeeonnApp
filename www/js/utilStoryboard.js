"use strict";

var app = app || {};
app.utilStoryboard = {};


// Show storyboard in full screen
app.utilStoryboard.showFullScreen = function (storyboardData) {
    var self = this;
    $("#divDialogContainer").show();
    new app.dialog.view.StoryboardFullScreen(storyboardData, function (success, data) {
        app.util.hideDialog();
    });
}
