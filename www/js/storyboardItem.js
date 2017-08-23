"use strict";

var app = app || {};
app.items = app.items || {};
app.items.view = app.items.view || {};


// A single storyboard item
app.items.view.StoryboardItem = Backbone.View.extend({

    className: "divStoryboardItemContainer",

    template: _.template($("#templateStoryboardItem").html()),

    events: {
        "click .divButtonShare": "share",
        "click .divButtonDelete": "delete",
        "click .divButtonEdit": "edit",
        "click .divButtonComment": "comment",
        "click .divButtonStar": "star",
        "click .divInner": "fullScreen"
    },


    // page = search, account, user
    initialize: function (page, data) {
        var self = this;
        this.page = page;
        this.data = data;
        this.selectedIndex = 0;
        this.newOrientation = null;
        this.render();

        // on appResized event
        app.events.on("appResized", function () {
            self.updateLayout();
        })
    },


    render: function () {
        var self = this;

        this.$el.html(this.template({
            storyboard_id: this.data.storyboard_id,
            storyboard_offline_id: this.data.storyboard_offline_id,
            title: this.data.title,
            category: this.data.category,
            username: this.data.username
        }));


        // set colors/patterns        
        this.$el.find(".divInner").css({ "background-color": this.data.scene_color });
        this.$el.find(".divActualText *").css({ "color": this.data.text_color });


        // set the first scene up
        if (this.data.scenes !== undefined && this.data.scenes.length > 0) {

            // hide scene numbers if only 1 scene
            if (this.data.scenes.length === 1) {
                this.$el.find(".divLabelSceneNumberContainer").hide();
            }

            // setup
            this.setSelectedScene();
        }


        // Hide delete and edit icons if on public page
        if (this.page === "search" || this.page === "user") {
            this.$el.find(".divIconPrivate").hide();
            this.$el.find(".divButtonEdit").hide();
            this.$el.find(".divButtonDelete").hide();

        // show the private icon if storyboard is private and on edit page
        } else {
            if (this.data.is_private === "1") {
                this.$el.find(".divButtonPrivate").css({ "display": "inline-block" });
            }
        }


        // hide comments if not required
        if (this.data.allow_comments === "0") {
            this.$el.find(".divButtonComment").hide();
            this.$el.find(".divCommentNumber").hide();
        }


        // Setup swipe events on storyboard items
        this.$el.find(".divInner").each(function (index) {
            var hammertime = new Hammer(this);
            hammertime.on('swiperight', function(ev) {
                self.previousScene();
            });

            hammertime.on('swipeleft', function(ev) {
                self.nextScene();
            });
        });


        // update layout
        this.updateLayout();


        return this;
    },



    // resize storyboards when orientation changes
    updateLayout: function () {
        var appWidth = $("#divMainContent")[0].offsetWidth  - 20;
        var storyboardHeight = appWidth / 2;

        this.$el.find(".divInner").css({
            "height": storyboardHeight + "px"
        });

        this.$el.find(".divActualText").css({ "max-height": storyboardHeight + "px" });
        this.$el.find(".divLabelTitleContainer").css({ "width": (appWidth - 140) + "px" });

        if (appWidth < $("#divMainContent")[0].offsetHeight) {
            this.$el.find(".divDetailsBottom").css({ "padding": 0 });
        } else {
            this.$el.find(".divDetailsBottom").css({ "padding": "0 20px" });
        }
    },


    // ------------------------------------- Select a scene -------------------------------------


    // Set the selected scene
    setSelectedScene: function () {

        // Scene number label
        this.$el.find(".labelSceneNumber").text((this.selectedIndex + 1) + "/" + this.data.scenes.length);

        this.$el.find(".divPicture").empty();
        this.$el.find(".divActualText").empty();
        this.$el.find(".divPicture").unbind();
        this.$el.find(".divActualText").unbind();



        // text
        var text = this.data.scenes[this.selectedIndex].text;
        if (text !== null && text.length > 0) {

            // replace hashtags and links with clickable link elements
            var newText = text.replace(app.data.regexHashtag, "<a class='aSceneHashtag'>$&</a>")
            newText = newText.replace(app.data.regexUrl, "<a class='aSceneUrl'>$&</a>")

            this.$el.find(".divActualText").append(newText);
        }


        // TODO - this is also used elsewhere, move to util
        // canvas image (append as svg)
        var canvasImage = this.data.scenes[this.selectedIndex].canvas_data_svg;
        if (canvasImage !== null && canvasImage.length > 0) {

            // change svg image routes
            if (this.page === "search" || this.page === "user") {
                canvasImage = canvasImage.replace(app.data.regexImageProxy,
                                                  app.data.serverHost + "/image-proxy-public/" +
                                                  this.data.user_id);
            } else {
                canvasImage = canvasImage.replace(app.data.regexImageProxy,
                                                  app.data.serverHost + "/api/image-proxy/" +
                                                  app.util.getUserApiToken());
            }

            canvasImage = app.util.setSvgViewbox(canvasImage);

            this.$el.find(".divPicture").append(canvasImage);

            // Listen for image loading error - if azure isn't connected or whatever
            this.$el.find("image").on("error", function (e) {
                app.util.showToast("Error loading images");
            });
        }


        // setup element sizes
        var sceneType = this.data.scenes[this.selectedIndex].type;
        switch (sceneType) {
            case "canvastext":
                this.$el.find(".divPicture").css({
                    "display": "block",
                    "float": "left",
                    "width": "50%",
                });
                this.$el.find(".divText").css({
                    "display": "block",
                    "float": "right",
                    "width": "50%",
                });
                break;

            case "textcanvas":
                this.$el.find(".divPicture").css({
                    "display": "block",
                    "float": "right",
                    "width": "50%",
                });
                this.$el.find(".divText").css({
                    "display": "block",
                    "float": "left",
                    "width": "50%",
                });
                break;

            case "canvas":
                this.$el.find(".divText").css({
                    "display": "none"
                });
                this.$el.find(".divPicture").css({
                    "display": "block",
                    "width": "100%",
                });
                break;

            case "text":
                this.$el.find(".divPicture").css({
                    "display": "none"
                });
                this.$el.find(".divText").css({
                    "display": "block",
                    "width": "100%",
                });
                break;
        }

    },





    // ------------------------------------- Storyboard Actions -------------------------------------

    // Go to next scene
    nextScene: function () {
        if (this.selectedIndex < this.data.scenes.length - 1) {
            this.selectedIndex += 1;
            this.setSelectedScene();
        }
    },


    // Go to previous scene
    previousScene: function () {
        if (this.selectedIndex > 0) {
            this.selectedIndex -= 1;
            this.setSelectedScene(this.selectedIndex);
        }
    },


    // share
    share: function (e) {
        e.stopPropagation();
    },


    // comment
    comment: function (e) {
        e.stopPropagation();
    },


    // star
    star: function (e) {
        e.stopPropagation();
    },


    // show full screen
    fullScreen: function (e) {
        e.stopPropagation();
        app.utilStoryboard.showFullScreen(this.data);
    },



    // Go to edit-storyboard page
    edit: function (e) {
        e.stopPropagation();
        var storyboard_id = -1;

        if (app.util.isOfflineMode() === false) {
            storyboard_id = this.$el.find(".divStoryboardItem").data("storyboard_id");
        } else {
            storyboard_id = this.$el.find(".divStoryboardItem").data("storyboard_offline_id");
        }

        app.router.navigate("edit-storyboard/" + storyboard_id, { trigger: true });
    },


    // Delete storyboard
    delete: function (e) {
        e.stopPropagation();

        var storyboard_id = this.$el.find(".divStoryboardItem").data("storyboard_id");

        if (this.page === "account") {
            var self = this;

            var dialogData = {
                heading: "Delete Storyboard",
                text1: "Are you sure you want to delete this Storyboard ?",
                text2: "Its Scenes will also be deleted and it cannot be undone"
            }

            // show delete storyboard dialog
            $("#divDialogContainer").show();
            new app.dialog.view.OkCancel(dialogData, function (result) {
                app.util.hideDialog();
                if (result === true) {

                    // delete storyboard
                    app.server.deleteStoryboard(self.data, function (success, result) {
                        if (success === true) {
                            app.currentView.currentView.deleteStoryboard(self);
                        }
                    });
                }
            });
        }
    }

});
