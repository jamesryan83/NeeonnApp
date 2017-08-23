"use strict";

var app = app || {};
app.dialog = app.dialog || {};
app.dialog.view = app.dialog.view || {};




// Create Storyboard dialog
app.dialog.view.CreateStoryboard = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogCreateStoryboard").html()),

    events: {
        "click #buttonDialogOk": "ok",
        "click #buttonDialogCancel": function () {this.callback(false) }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());

        // Add category options to select element
        for (var i = 0; i < app.data.categories.length; i++) {
            this.$el.find("#selectCategory").append(
                "<option value='" + app.data.categories[i] + "'>" +
                app.data.categories[i] + "</option>");
        }

        return this;
    },


    // ok button clicked
    ok: function () {
        var title = this.$el.find("#inputTitle").val().trim();

        // Validate inputs
        if (title.length === 0) {
            app.util.showToast("Error: You need to enter a Title");
            return;
        }

        if (title.length > 70) {
            app.util.showToast("Error: Title is 70 character limit.  You have "
                               + title.length + " characters");
            return;
        }

        var currentTime = new Date();
        var storyboard_offline_id = new Date().getTime();

        // same data as from server
        var data = {
            title: title,
            category: $("#selectCategory").val(),
            is_private: $("#checkboxPrivate").prop('checked') ? "1" : "0",
            allow_comments: $("#checkboxAllowComments").prop('checked') ? "1" : "0",
            created_at: currentTime,
            updated_at: currentTime,
            scene_color: "#ffffff",
            scene_pattern: "",
            storyboard_id: null,
            storyboard_offline_id: storyboard_offline_id,
            text_color: "#b3b3b3",
            user_id: null,
            username: null,
            scenes: [{
                user_id: null,
                storyboard_id: null,
                storyboard_offline_id: storyboard_offline_id,
                storyboard_index: 0,
                text: "",
                canvas_data_json: null,
                canvas_data_svg: null,
                type: $("#selectFirstScene").val(),
                created_at: currentTime,
                updated_at: currentTime
            }]
        }

        this.callback(true, data);
    }
});




// Change Password dialog
app.dialog.view.ChangePassword = Backbone.View.extend({
    el: "#divDialogContainer",

    template: _.template($("#templateDialogChangePassword").html()),

    events: {
        "click #buttonChangePassword": "changePassword",
        "click #buttonReturn": function () { this.callback(false); }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    // Change password
    changePassword: function () {
        var data = {
            oldPassword: $("#inputChangePasswordOld").val(),
            newPassword: $("#inputChangePasswordNew").val(),
            newPassword_confirmation: $("#inputChangePasswordNewConfirmation").val()
        }

        // Validate inputs
        if (data.oldPassword.length < 6 || data.newPassword.length  < 6
                || data.newPassword_confirmation.length  < 6) {
            app.util.showToast("Inputs must be at least 6 characters");
            return;
        }

        if (data.oldPassword === data.newPassword) {
            app.util.showToast("New and Old passwords must be different");
            return;
        }

        if (data.newPassword !== data.newPassword_confirmation) {
            app.util.showToast("New password and Confirm new password must match");
            return;
        }

        // return data
        this.callback(true, data);
    }
});




// Ok Cancel dialog
app.dialog.view.OkCancel = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogOkCancel").html()),

    events: {
        "click #buttonDialogOk": function () {this.callback(true) },
        "click #buttonDialogCancel": function () {this.callback(false) }
    },

    initialize: function (data, callback) {
        this.data = data;
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template(this.data));
        return this;
    }
});




// Add Scene dialog
app.dialog.view.AddScene = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogAddScene").html()),

    events: {
        "click #divButtonTextCanvas": function () {this.callback(true, "textcanvas") },
        "click #divButtonCanvasText": function () {this.callback(true, "canvastext") },
        "click #divButtonTextOnly": function () {this.callback(true, "text") },
        "click #divButtonCanvasOnly": function () {this.callback(true, "canvas") },
        "click #buttonDialogCancel": function () {this.callback(false) }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});




// Edit storyboard details dialog
app.dialog.view.EditStoryboardDetails = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogEditStoryboardDetails").html()),

    events: {
        "click #buttonDialogOk": "save",
        "click #buttonDialogCancel": function () {this.callback(false) }
    },

    initialize: function (data, callback) {
        this.data = data;
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());

        // Add category options to select element
        for (var i = 0; i < app.data.categories.length; i++) {
            $("#selectEditStoryboardCategory").append(
                "<option value='" + app.data.categories[i] + "'>" +
                app.data.categories[i] + "</option>");
        }

        // set current storyboard details
        $("#inputEditStoryboardTitle").val(this.data.title);
        $("#selectEditStoryboardCategory").val(this.data.category);
        $("#checkboxPrivate").prop("checked", this.data.is_private === "1" ? true : false);
        $("#checkboxAllowComments").prop("checked", this.data.allow_comments === "1" ? true : false);

        return this;
    },


    // Return values
    save: function () {
        var data = {
            title: $("#inputEditStoryboardTitle").val(),
            category: $("#selectEditStoryboardCategory").val(),
            is_private: $("#checkboxPrivate").prop("checked") ? "1" : "0",
            allow_comments: $("#checkboxAllowComments").prop("checked") ? "1" : "0"
        }

        // Validate inputs
        if (data.title.length === 0) {
            app.util.showToast("Error: You need to enter a Title");
            return;
        }

        if (data.title.length > 70) {
            app.util.showToast("Error: Title is 70 character limit.  You have "
                               + title.length + " characters");
            return;
        }

        this.callback(true, data);
    }
});




// Search storyboards dialog
app.dialog.view.Search = Backbone.View.extend({
    el: "#divDialogContainer",

    template: _.template($("#templateDialogSearch").html()),

    events: {
        "click #buttonSearchGo": "search",
        "click #checkboxSearchTitles": "checkboxClicked",
        "click #checkboxSearchUsernames": "checkboxClicked",
        "click #checkboxSearchText": "checkboxClicked",
        "click #buttonSearchCancel": function () { this.callback(false) }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        var self = this;

        // Add category options to select element
        $("#selectSearchCategory").append("<option value='All Categories'>All Categories</option>");
        for (var i = 0; i < app.data.categories.length; i++) {
            $("#selectSearchCategory").append(
                "<option value='" + app.data.categories[i] + "'>" +
                app.data.categories[i] + "</option>");
        }

        // Add sortby options to select element
        for (var i = 0; i < app.data.searchSortBy.length; i++) {
            $("#selectSearchSortBy").append(
                "<option value='" + app.data.searchSortBy[i] + "'>" +
                app.data.searchSortBy[i] + "</option>");
        }

        return this;
    },


    // Keep at least one checkbox checked
    checkboxClicked: function (e) {
        $("#checkboxSearchTitles").prop('checked', false);
        $("#checkboxSearchUsernames").prop('checked', false);
        $("#checkboxSearchText").prop('checked', false);

        $(e.target).prop("checked", true);
    },


    // search
    search: function () {
        var data = {
            searchTerm: $("#inputSearchTerm").val(),
            category: $("#selectSearchCategory option:selected").text(),
            sortBy: $("#selectSearchSortBy option:selected").text(),
            searchTitles: $("#checkboxSearchTitles").prop('checked'),
            searchUsernames: $("#checkboxSearchUsernames").prop('checked'),
            searchText: $("#checkboxSearchText").prop('checked')
        }

        this.callback(true, data);
    }
});




// Full screen storyboard dialog
app.dialog.view.StoryboardFullScreen = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogStoryboardFullScreen").html()),

    events: {
        "click #divCloseButton": "close"
    },

    initialize: function (storyboardData, callback) {
        var self = this;
        this.data = storyboardData;
        this.callback = callback;
        this.render();


        // after rendered
        setTimeout(function () {
            var sceneDivs = self.$el.find(".divSceneItem");

            var sceneWidth = (self.$el.find("#divContent")[0].clientWidth - 20);
            var halfSceneWidth = sceneWidth / 2;


            // center text vertically when text height < sceneDiv height
            for (var i = 0; i < sceneDivs.length; i ++) {
                var sceneType = $(sceneDivs[i]).data("type");

                if (sceneType === "canvas") {
                    $(sceneDivs[i]).find("svg")[0]

                } else if (sceneType === "canvastext" || sceneType === "textcanvas") {

                    // TODO - sceneDivs[i].offsetHeight <= halfSceneWidth + 2 is enough or too much ?
                    if (sceneDivs[i].offsetHeight <= halfSceneWidth + 2) {
                        $(sceneDivs[i]).css({ "height": halfSceneWidth + "px" })

                        $(sceneDivs[i]).children().not("div")
                            .wrapAll("<div class='divCenterSceneVertical'></div>")
                            .wrapAll("<div class='divCenterSceneVerticalInner'></div>");
                    }
                }
            }

        }, 0);
    },

    render: function() {
        this.$el.html(this.template({
            title: this.data.title,
            username: this.data.username,
            category: this.data.category
        }));


        // set height of content area
        var screenHeight = $("#divAppContainer")[0].offsetHeight;
        this.$el.find("#divContent").css({ "height": screenHeight - 60 });;


        // get height for scenes
        var sceneWidth = this.$el.find("#divContent")[0].clientWidth - 20;
        var halfSceneWidth = (sceneWidth / 2) - 10;

        this.$el.find("#divContent").append($("<div class='divSceneGap'></div>"));
        // <div class='divSceneGap'><hr></div>

        // append scenes
        for (var i = 0; i < this.data.scenes.length; i++) {

            var sceneDiv = "<div class='divSceneItem' data-type='" + this.data.scenes[i].type + "'>";


            // canvas image
            var canvasImage = this.data.scenes[i].canvas_data_svg;
            if (canvasImage !== null && canvasImage.length > 0) {

                canvasImage = canvasImage.replace(app.data.regexImageProxy,
                                                  app.data.serverHost + "/image-proxy-public/" +
                                                  this.data.user_id);

                canvasImage = app.util.setSvgViewbox(canvasImage);

                if (this.data.scenes[i].type === "canvastext") {
                    sceneDiv += "<div class='divImageLeft'>" + canvasImage + "</div>";
                } else if (this.data.scenes[i].type === "textcanvas") {
                    sceneDiv += "<div class='divImageRight'>" + canvasImage + "</div>";
                } else {
                    sceneDiv += "<div class='divImageCenter'>" + canvasImage + "</div>";
                }
            }


            // text
            var text = this.data.scenes[i].text;
            if (text !== null && text.length > 0) {

                // replace hashtags and links with clickable link elements
                var newText = text.replace(app.data.regexHashtag, "<a class='aSceneHashtag'>$&</a>")
                newText = newText.replace(app.data.regexUrl, "<a class='aSceneUrl'>$&</a>")

                sceneDiv += newText;
            }


            // append to storyboard thing
            sceneDiv += "</div>";
            this.$el.find("#divContent").append($(sceneDiv));
            this.$el.find("#divContent").append($("<div class='divSceneGap'></div>"));
        }   // <div class='divSceneGap'><hr></div>

        return this;
    },


    close: function () {
        this.callback(false)
    }
});




// Add image to canvas dialog
app.dialog.view.AddImage = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogAddImage").html()),

    events: {
        "click #buttonFromGallery": function () { this.callback(true, "fromGallery"); },
        "click #buttonFromUrl": "fromUrl",
        "click #buttonFromUrlOk": "fromUrlOk",
        "click #buttonRemoveImage": function () { this.callback(true, "removeImage"); },
        "click #buttonCancel": function () { this.callback(false); }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());

        if (app.util.isOfflineMode() === true) {
            this.$el.find("#buttonFromUrl").hide();
        }
    },


    // return a url
    fromUrl: function () {
        this.$el.find("#divButtons").hide();
        this.$el.find("#divFromUrl").show();

        this.$el.find("#divAddImage").css({ "width": 310 });
    },


    // return the url
    fromUrlOk: function () {
        var providedUrl = this.$el.find("#inputFromUrl").val();

        // validation
        if (app.util.stringStartsWithHttpOrHttps(providedUrl) === false ||
            app.util.stringEndsWithImageExtension(providedUrl) === false) {
            return;
        }

        this.callback(true, providedUrl);
    }
});




// Edit image for canvas dialog
app.dialog.view.EditImage = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogEditImage").html()),

    events: {
        "click #buttonEditImageCrop": "crop",
        "click #buttonEditImageDontCrop": function () { this.callback(true); }
    },

    initialize: function (isFullWidth, imagePath, callback) {
        this.isFullWidth = isFullWidth;
        this.imagePath = imagePath;
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template({ imagePath: this.imagePath }));

        $("#imgMain").cropper({
            viewMode: 0,
            guides: false,
            center: false,
            background: false,
            modal: false,
            moveable: false,
            rotatable: false,
            scalable: false,
            zoomable: false,
            zoomOnTouch: false,
            minCropBoxWidth: 50,
            minCropBoxHeight: 50,
            aspectRatio: this.isFullWidth ? 2 : 1
        });
    },

    crop: function () {
//        var cropData = $('#imgMain').cropper("getData", true);
//        console.log(cropData)

        var self = this;
        var canvas = $('#imgMain').cropper("getCroppedCanvas", { fillColor: "#ffffff" });
        canvas.toBlob(function (blob) {

            var imageName = app.util.getFilenameFromImageUrl(self.imagePath);

            app.fileFolder.saveBlobToFile(imageName, blob, function (success) {
                self.callback(success);
            })
        }, "image/jpeg");
    }
});
