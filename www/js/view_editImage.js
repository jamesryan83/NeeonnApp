"use strict";

var app = app || {};
app.editImage = {};
app.editImage.view = {};


// delete server temp image if user navigates away without using save or cancel
//window.onbeforeunload = function () {
//    if (app.editImage.view.editImage.exitedNormally === false) {
//        app.server.deleteTempImage(app.util.getFilenameFromImageUrl($("#imgMain").attr("src")),
//           function (success, result) {
//            // do nothing
//        });
//    }
//}


// Edit Image
app.editImage.view.EditImage = Backbone.View.extend({

//    el: "#divEditImage",
//
//    events: {
//        "click #divFilters > button" : "filter",
//        "click #buttonAspectFree": function () { this.setAspectRatio("free"); },
//        "click #buttonAspectHalfWidth": function () { this.setAspectRatio("half"); },
//        "click #buttonAspectFullWidth": function () { this.setAspectRatio("full"); },
//        "click #buttonSave": "save",
//        "click #buttonCancel": "cancel"
//    },
//
//    initialize: function () {
//        this.filename = "";
//        this.imageData = "";
//        this.exitedNormally = false;
//
//        // loop until image is loaded then apply cropping thing
//        var self = this;
//        var waitForImageLoad = setInterval(function () {
//            var img = document.getElementById("imgMain");
//            if (img.naturalHeight > 0) {
//                clearInterval(waitForImageLoad);
//                self.setupCropping();
//                $("#divLoading").hide();
//            }
//        }, 500);
//    },
//
//
//    // Setup cropping
//    setupCropping: function () {
//        var self = this;
//
//        var img = document.getElementById("imgMain");
//        var canvas = document.getElementById("imgMainPreview");
//        var ctx = canvas.getContext("2d");
//
//        canvas.width = img.naturalWidth;
//        canvas.height = img.naturalHeight;
//
//        $('#imgMain').cropper({
//            viewMode: 1,
//            guides: false,
//            center: false,
//            background: false,
//            moveable: false,
//            rotatable: false,
//            scalable: false,
//            zoomable: false,
//            minCropBoxWidth: 50,
//            minCropBoxHeight: 50,
//            crop: function(data) {
//
//                // redraw preview image
//                ctx.clearRect(0, 0, canvas.width, canvas.height);
//                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
//
//                self.applyPreviewMask(ctx, img, data);
//            }
//        });
//    },
//
//
//    // Apply filter to image preview
//    filter: function (e) {
//        Caman.Store.flush();
//
//        var self = this;
//        var filter = $(e.target).data("preset");
//
//        var img = document.getElementById("imgMain");
//        var canvas = document.getElementById("imgMainPreview");
//        var ctx = canvas.getContext("2d");
//
//        Caman("#imgMainPreview", $("#imgMain").attr("src"), function () {
//            this.revert(true);
//
//            // apply filter, or revert to original
//            if (filter !== "none") {
//                this[filter]();
//            } else {
//                self.applyPreviewMask(ctx, img);
//                return;
//            }
//
//            $("#pFilters").text("Applying Filter...");
//            this.render(function () {
//                self.applyPreviewMask(ctx, img);
//                $("#pFilters").text("Filters");
//            });
//        });
//    },
//
//
//    // set aspect ratio of cropper
//    setAspectRatio: function (size) {
//        var aspectRatio = null;
//        switch (size) {
//            case "free":
//                aspectRatio = null;
//                break;
//            case "half":
//                aspectRatio = app.data.sceneWidthHalf / app.data.sceneHeight;
//                break;
//            case "full":
//                aspectRatio = app.data.sceneWidth / app.data.sceneHeight;
//                break;
//        }
//
//        $('#imgMain').cropper("setAspectRatio", aspectRatio);
//    },
//
//
//    // mask over preview image showing cropping
//    applyPreviewMask: function(ctx, img, data) {
//        if (data === undefined) {
//            data = $('#imgMain').cropper("getData", true);
//        }
//
//        ctx.fillStyle="#FFFFFF";
//        ctx.fillRect(0, 0, img.naturalWidth, data.y); // top
//        ctx.fillRect(data.width + data.x, 0, img.naturalWidth, img.naturalHeight); // right
//        ctx.fillRect(0, data.height + data.y, img.naturalWidth, img.naturalHeight); // bottom
//        ctx.fillRect(0, 0, data.x, img.naturalHeight); // left
//    },
//
//
//    // Upload edited image to server
//    save: function () {
//        var self = this;
//        $("#divLoading").show();
//        var cropData = $('#imgMain').cropper("getData", true);
//        var imageName = app.util.getFilenameFromImageUrl($("#imgMain").attr("src"));
//        var imageData = document.getElementById("imgMainPreview").toDataURL("image/png");
//
//        app.server.saveUpdatedImage(cropData, imageName, imageData, function (success, result) {
//            if (success === true) {
//                self.returnToPreviousPage();
//            } else {
//                $("#divLoading").hide();
//            }
//        });
//    },
//
//
//    // Cancel changes and return to Gallery page
//    cancel: function () {
//        var self = this;
//        $("#divLoading").show();
//        var fileName = app.util.getFilenameFromImageUrl($("#imgMain").attr("src"));
//        app.server.deleteTempImage(fileName, function (success, result) {
//            self.returnToPreviousPage();
//        }, true);
//    },
//
//
//    // Return to the previous page
//    returnToPreviousPage: function () {
//        this.exitedNormally = true;
//
//        var previousPage = Cookies.get("previousPage");
//        if (previousPage !== "accountGallery") {
//            location.href = previousPage;
//        } else  {
//            location.href = "../account/gallery";
//        }
//    }
});

