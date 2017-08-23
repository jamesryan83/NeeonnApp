"use strict";

var app = app || {};
app.serverOffline = {};



// ---------------------------------------- Images ----------------------------------------

// get images for gallery
app.serverOffline.getGalleryImages = function (callback) {

}


// Returns an image from a provided url
app.serverOffline.getImageFromUrl = function (providedUrl, callback) {

}


// Save updated image
app.serverOffline.saveUpdatedImage = function (cropData, imageName, imageString, callback) {

}


// Delete a temporary image (for edit-image page)
app.serverOffline.deleteTempImage = function (imageName, callback) {

}


// Delete an image
app.serverOffline.deleteImage = function (imageName, callback, isTempImage) {

}







// ------------------------------------- Storyboards -------------------------------------


// Get storyboard
app.serverOffline.getStoryboard = function (storyboard_offline_id, callback) {
    app.fileFolder.readFile("Neeonn/storyboards/" + storyboard_offline_id + ".json",
                            function (success, data) {
        if (success === true) {
            callback(success, JSON.parse(data));
        } else {
            callback(success, data);
        }
    });
}


// Get all storyboards
app.serverOffline.getAllStoryboards = function (callback) {
    app.fileFolder.readDataFromMultipleFiles("Neeonn/storyboards", callback);
}


// Create storyboard
app.serverOffline.createStoryboard = function (data, callback) {
    app.fileFolder.createFile("Neeonn/storyboards/" + data.storyboard_offline_id + ".json", true,
                              JSON.stringify(data), callback);
}



// Save storyboard
app.serverOffline.saveStoryboard = function (data, callback) {
    var fileName = "Neeonn/storyboards/" + data.storyboard_offline_id + ".json";

    app.fileFolder.deleteFile(fileName, function (success) {
        if (success === true) {
            app.fileFolder.createFile(fileName, true, JSON.stringify(data), callback);
        } else {
            callback(false);
        }
    })
}


// Delete storyboard
app.serverOffline.deleteStoryboard = function (data, callback) {
    app.fileFolder.deleteFile("Neeonn/storyboards/" + data.storyboard_offline_id + ".json", callback);
}







// ------------------------------------- Account -------------------------------------


// Get user account details
app.serverOffline.getUserAccountDetails = function (callback) {

}


// Update account details
app.serverOffline.updateAccount = function (data, callback) {

}


// Change password
app.serverOffline.changePassword = function (data, callback) {

}


// Enable account
app.serverOffline.enableAccount = function (callback) {

}


// Disable account
app.serverOffline.disableAccount = function (callback) {

}


// Check if user is logged in
app.serverOffline.isUserLoggedIn = function (callback) {

}


// Logout
app.serverOffline.logout = function (callback) {

}


// Delete account
app.serverOffline.deleteAccount = function (callback) {

}






// ------------------------------------- Search -------------------------------------


// Search storyboards
app.serverOffline.search = function (data, callback) {

}



