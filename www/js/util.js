"use strict";

var app = app || {};
app.util = {};



// --------------------------------------- Strings ---------------------------------------


// Returns the filename from an image url
app.util.getFilenameFromImageUrl = function (url) {
    var temp = url.split("/");
    return temp[temp.length - 1];
}


// check string starts with http or https
app.util.stringStartsWithHttpOrHttps = function (text) {
    if (app.util.stringStartsWith(text, "http://") === false &&
        app.util.stringStartsWith(text, "https://") === false) {
        alert("Error", "Url must start with http:// or https://");
        return false;
    }

    return true;
}


// check string ends with jpg, jpeg, png or gif
app.util.stringEndsWithImageExtension = function (text) {
    if (app.util.stringEndsWith(text, ".jpg") === false &&
            app.util.stringEndsWith(text, ".jpeg") === false &&
            app.util.stringEndsWith(text, ".png") === false &&
            app.util.stringEndsWith(text, ".gif") === false) {
            alert("Error", "Url must end with .jpg, .jpeg, .png or.gif");
            return false;
        }

    return true;
}


// check if string starts with *
app.util.stringStartsWith = function(text, textToFind) {
    return text.indexOf(textToFind) === 0;
};


// check if string ends with *
app.util.stringEndsWith = function(text, textToFind) {
    var index = text.length - textToFind.length;
    return index >= 0 && text.lastIndexOf(textToFind) === index;
};




// --------------------------------------- Storage ---------------------------------------

// Add item to local storage
app.util.addToLocalStorage = function (key, value) {
    localStorage.setItem(key, value);
}


// Load item from local storage
app.util.loadFromLocalStorage = function (key) {
    return localStorage.getItem(key);
}


// Load item from local storage
app.util.deleteFromLocalStorage = function (key) {
    localStorage.removeItem(key);
}


// Returns the users api_token
app.util.getUserApiToken = function () {
    var api_token = app.util.loadFromLocalStorage("api_token");

//    if (api_token === null) {
//        app.router.navigate("/", { trigger: true });
//        return null;
//    }

    return api_token;
}

// Get if user is in offline mode or not
app.util.isOfflineMode = function () {
    var offlineMode = app.util.loadFromLocalStorage("offlineMode");
    return offlineMode === "yes" ? true : false;
}



// --------------------------------------- Arrays ---------------------------------------


// sort array
// http://stackoverflow.com/a/8837505
app.util.sortArray = function (array, property) {
    return array.sort(function(a, b) {
        var x = a[property]; var y = b[property];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// sort integer array
app.util.sortIntegerArray = function (array, property) {
    return array.sort(function(a, b) {
        return a[property] - b[property];
    });
}

// Change the position of an element in an array
// http://stackoverflow.com/a/6470794
app.util.changePositionInArray = function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}








// --------------------------------------- Other ---------------------------------------

// Prevents the windown scrolling when scrolling inside an element
app.util.preventWindowScroll = function (element) {
    element.on("mousewheel", function (e) {
        var event = e.originalEvent;
        var d = event.wheelDelta || -event.detail;
        this.scrollTop += ( d < 0 ? 1 : -1 ) * 30;
        e.preventDefault();
    });
}


// Show a popup message
app.util.showToast = function (message) {
    console.log(message)
    if (window.plugins !== undefined) {
        window.plugins.toast.show(message, "short", "center");
    }
}


// Hide dialog
app.util.hideDialog = function () {
    $("#divDialogContainer").hide();
    $("#divDialogContainer").empty();
    $("#divDialogContainer").unbind();
}


// Scroll a divs scrollbar to the bottom
// http://stackoverflow.com/a/6853354
app.util.scrollDivToBottom = function (selector) {
    $(selector).scrollTop($(selector)[0].scrollHeight);
}


// Move caret to end of contenteditable
// http://stackoverflow.com/a/4238971
app.util.placeCaretAtEnd = function (el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}


// Get current device type from user agent - Chrome browser returns null
app.util.getCurrentDeviceType = function () {
    var deviceType = (navigator.userAgent.match(/iPad/i))  ==
            "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  ==
            "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) ==
            "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) ==
            "BlackBerry" ? "BlackBerry" : "null";

    return deviceType;
}



// Zoom in or out a dom element.  set element transform: scale(0, 0);
app.util.animateZoomElement = function (zoomIn, element, callback) {
    var count = zoomIn === true ? 0 : 10;
    var scale = 0;
    var interval = setInterval(function () {
        scale = count / 10;

        $("#" + element).css({
            "transform": "scale(" + scale + ", " + scale + ")",
            "-webkit-transform": "scale(" + scale + ", " + scale + ")"
        });

        if (zoomIn === true) {
            count += 1;
            if (count > 10) {
                window.clearInterval(interval);
                if (callback) {
                    callback();
                }
            }
        } else {
            count -= 1;
            if (count < 0) {
                window.clearInterval(interval);
                if (callback) {
                    callback();
                }
            }
        }
    }, 10);
}


// Sets an svg's viewbox to the size of its contents so it can be scaled with css % width/height
app.util.setSvgViewbox = function (canvasImage) {
    var canvasXml = $.parseXML(canvasImage)
    var width = $(canvasXml).find("svg").attr("width");
    var height = $(canvasXml).find("svg").attr("height");
    $(canvasXml).find("svg").attr("viewbox", "0 0 " + width + " " + height);
    return (new XMLSerializer()).serializeToString(canvasXml);
}
