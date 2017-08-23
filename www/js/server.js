"use strict";

var app = app || {};
app.server = {};



// ---------------------------------------- Images ----------------------------------------

//// get images for gallery
//app.server.getGalleryImages = function (callback) {
//    app.server.ajaxRequest("GET", "/get-gallery-images", null, "Error getting gallery images", callback);
//}
//
//
//// Returns an image from a provided url
//app.server.getImageFromUrl = function (providedUrl, callback) {
//    app.server.ajaxRequest("POST", "/upload-image-url", {
//        url: providedUrl
//    }, "Error getting image from url", callback);
//}
//
//
//// Save updated image
//app.server.saveUpdatedImage = function (cropData, imageName, imageString, callback) {
//    app.server.ajaxRequest("POST", "/update-image", {
//        cropData: cropData,
//        imageName: imageName,
//        imageString: imageString
//    }, "Error saving image", callback);
//}
//
//
//// Delete a temporary image (for edit-image page)
//app.server.deleteTempImage = function (imageName, callback) {
//    app.server.deleteImage(imageName, callback, true);
//}
//
//
//// Delete an image
//app.server.deleteImage = function (imageName, callback, isTempImage) {
//    var url = "/delete-image";
//    if (isTempImage === true) {
//        url = "/delete-temp-image";
//    }
//
//    app.server.ajaxRequest("POST", url, {
//        imageName: imageName
//    }, "Error deleting image", callback);
//}







// ------------------------------------- Storyboards -------------------------------------


// Get storyboard
app.server.getStoryboard = function (storyboard_id, callback) {
    if (app.util.isOfflineMode() === false) {
        app.server.ajaxRequest("GET", "/get-storyboard/" + storyboard_id, null, true,
                               "Error getting Storyboard", callback);
    } else {
        app.serverOffline.getStoryboard(storyboard_id, callback);
    }
}


// Get all storyboards
app.server.getAllStoryboards = function (callback) {
    if (app.util.isOfflineMode() === false) {
        app.server.ajaxRequest("GET", "/get-all-storyboards", null, true,
                               "Error getting Storyboards", callback);
    } else {
        app.serverOffline.getAllStoryboards(callback);
    }
}


// Create storyboard
app.server.createStoryboard = function (data, callback) {
    if (app.util.isOfflineMode() === false) {
        app.server.ajaxRequest("POST", "/create-storyboard", { data: data }, false,
                               "Error creating Storyboard", callback);
    } else {
        app.serverOffline.createStoryboard(data, callback);
    }
}


// Update storyboard details
app.server.updateStoryboardDetails = function (data, callback) {
    if (app.util.isOfflineMode() === false) {
        app.server.ajaxRequest("POST", "/update-storyboard-details", { data: data }, false,
                               "Error updating Storyboard", callback);
    } else {
        app.serverOffline.saveStoryboard(data, callback);
    }
}


// Delete storyboard
app.server.deleteStoryboard = function (data, callback) {
    if (app.util.isOfflineMode() === false) {
        var serverData = {
            storyboard_id: data.storyboard_id,
            api_token: app.util.getUserApiToken()
        }
        app.server.ajaxRequest("POST", "/delete-storyboard", { data: serverData }, false,
                               "Error deleting Storyboard", callback);
    } else {
        app.serverOffline.deleteStoryboard(data, callback);
    }
}







// ------------------------------------- Scenes -------------------------------------


// Create scene
app.server.createScene = function (data, callback) {
    if (app.util.isOfflineMode() === false) {
        app.server.ajaxRequest("POST", "/create-scene", { data: data }, false,
                               "Error creating Scene", callback);
    } else {
        app.serverOffline.saveStoryboard(data, callback);
    }
}


// Update scene canvas
app.server.updateSceneCanvas = function (data, callback) {
    app.server.ajaxRequest("POST", "/update-scene-canvas", { data: data }, false,
                           "Error updating scene canvas", callback);
}


// Update scene text
app.server.updateSceneText = function (data, callback) {
    app.server.ajaxRequest("POST", "/update-scene-text", { data: data }, false,
                           "Error updating scene text", callback);
}


// Update scene indicies
app.server.updateSceneIndicies = function (data, callback) {
    if (app.util.isOfflineMode() === false) {
        app.server.ajaxRequest("POST", "/update-scene-indicies", { data: data }, false,
                               "Error updating scene indicies", callback);
    } else {
        app.serverOffline.saveStoryboard(data, callback);
    }
}


// Delete scene
app.server.deleteScene = function (data, callback) {
    if (app.util.isOfflineMode() === false) {
        app.server.ajaxRequest("POST", "/delete-scene", { data: data }, false,
                               "Error deleting scene", callback);
    } else {
        app.serverOffline.saveStoryboard(data, callback);
    }
}



// ------------------------------------- Account -------------------------------------

// Register
app.server.register = function (data, callback) {
    app.server.ajaxRequest("POST", "/register", { data: data }, false, "Error registering", callback);
}


// Login
app.server.login = function (data, callback) {
    app.server.ajaxRequest("POST", "/login", { data: data }, false, "Error logging in", callback);
}


// Get user account details
app.server.getUserAccountDetails = function (callback) {
    app.server.ajaxRequest("GET", "/get-account-details", null, true,
                           "Error getting account details", callback);
}


// Update account details
app.server.updateAccount = function (data, callback) {
    app.server.ajaxRequest("POST", "/update-account", { data: data }, false,
                           "Error updating account", callback);
}


// Change password
app.server.changePassword = function (data, callback) {
    app.server.ajaxRequest("POST", "/change-password", { data: data }, false,
                           "Error changing password", callback);
}


// Enable account
app.server.enableAccount = function (callback) {
    app.server.ajaxRequest("GET", "/enable-account", null, true, "Error enabling account", callback);
}


// Disable account
app.server.disableAccount = function (callback) {
    app.server.ajaxRequest("GET", "/disable-account", null, true, "Error disabling account", callback);
}


// Check if user is logged in
app.server.isUserLoggedIn = function (callback) {
    app.server.ajaxRequest("GET", "/user-logged-in", null, true,
                           "Token has expired.  You need to log in again", callback);
}


// Logout
app.server.logout = function (callback) {
    app.server.ajaxRequest("GET", "/logout", null, true, "Error logging out", callback);
}


// Delete account
app.server.deleteAccount = function (callback) {
    app.server.ajaxRequest("GET", "/delete-account", null, true, "Error deleting user", callback);
}






// ------------------------------------- Search -------------------------------------


// Search storyboards
app.server.search = function (data, callback) {
    app.server.ajaxRequest("POST", "/search", { data: data }, false, "Error searching", callback);
}






// ------------------------------------- Ajax -------------------------------------

// Generic ajax request
app.server.ajaxRequest = function (type, url, data, addApiToken, errorMessage, callback) {

    // check apkToken
    var api_token = app.util.getUserApiToken();
    if (api_token === null && url !== "/login" && url !== "/register") {
        app.router.navigate("/", { trigger: true });
        return;
    }

    // add apkToken and host
    url = app.data.serverHost + "/api" + url;
    if (addApiToken === true) {
        url += "/" + api_token;
    }


    // make request
    $.ajax({
        type: type,
        url: url,
        data: data,
        timeout: 20000,
        success: function (result) {
            if (result.success === true) {
                callback(true, result.data);
            } else {
                console.log(result);
                if (result.message !== undefined) {

                    // go to login screen if token is invalid
                    if (result.message === "Invalid api_token") {
                        // looks like infinte loop but is not, backbone won't renavigate to same route
                        app.router.navigate("/", { trigger: true });
                    } else {
                        app.util.showToast("Error : " + result.message);
                    }

                } else {
                    app.util.showToast(errorMessage);
                }

                callback(false, result);
            }
        },
        error: function (err) {
            if (err.statusText === "timeout") {
                app.util.showToast("Request Timeout.  Please try again.");
            } else {
                app.util.showToast("Server Error.  Please try again.");
            }

            console.log(JSON.stringify(err));
            callback(false, errorMessage);
        }
    });
}

// ajax responses from server are expected to be...
// success: { "success": true, "data": result }
// fail: { "success": false, "message": "error message" }



