"use strict";

var app = app || {};
app.items = app.items || {};
app.items.view = app.items.view || {};


// A Single Scene Item
app.items.view.SceneItem = Backbone.View.extend({

    className: "divSceneItemContainer",

    template: _.template($("#templateStoryboardSceneItem").html()),

    events: {
        "click .divSceneCanvas": "editCanvas",
        "click .divSceneText": "editText",
    },

    initialize: function (data, editStoryboard) {
        var self = this;

        this.editStoryboard = editStoryboard;
        this.data = data;
        this.render();

        // on appResized event
        app.events.on("appResized", function () {
            self.updateLayout();
        })
    },


    render: function () {
        this.$el.html(this.template({
            sceneType: this.data.type,
            sceneIndex: this.data.storyboard_index
        }));


        // show image/text based on scene type
        switch (this.data.type) {
            case "canvastext":
            case "textcanvas":
                this.$el.find(".divSceneCanvas").css({ "width": "50%" });
                this.$el.find(".divSceneText").css({ "width": "50%" });
                this.$el.find(".divSeparator").show();
                break;

            case "text":
                this.$el.find(".divSceneCanvas").css({ "width": 0 });
                this.$el.find(".divSceneText").css({ "width": "100%" });

                this.$el.find(".divDetailsTopLabelLeft").css({ "width": "100%" });
                this.$el.find(".divDetailsTopLabelLeft > label").text("Text");
                this.$el.find(".divDetailsTopLabelRight").hide();
                break;

            case "canvas":
                this.$el.find(".divSceneCanvas").css({ "width": "100%" });
                this.$el.find(".divSceneText").css({ "width": 0 + "px" });

                this.$el.find(".divDetailsTopLabelLeft").css({ "width": "100%" });
                this.$el.find(".divDetailsTopLabelLeft > label").text("Canvas");
                this.$el.find(".divDetailsTopLabelRight").hide();
                break;
        }


        // canvas text left or right
        if (this.data.type === "canvastext") {
            this.$el.find(".divSceneCanvas").css({ "float": "left" });
            this.$el.find(".divSceneText").css({ "float": "right" });

            this.$el.find(".divDetailsTopLabelLeft > label").text("Canvas");
            this.$el.find(".divDetailsTopLabelRight > label").text("Text");

        } else if (this.data.type === "textcanvas") {
            this.$el.find(".divSceneCanvas").css({ "float": "right" });
            this.$el.find(".divSceneText").css({ "float": "left" });

            this.$el.find(".divDetailsTopLabelLeft > label").text("Text");
            this.$el.find(".divDetailsTopLabelRight > label").text("Canvas");
        }


        this.updateCanvas();


        // Add data to scene
        if (this.data !== undefined && this.type !== "canvas") {
            this.$el.find(".divActualText").append(this.data.text);
        }


        // update layout
        this.updateLayout();

        return this;
    },



    // update the canvas
    updateCanvas: function () {
        // same code as in storyboardItem.js
        // canvas image (append as svg)
        var canvasImage = this.data.canvas_data_svg;
        if (canvasImage !== null && canvasImage.length > 0) {

            // change svg image routes
            if (this.page === "search" || this.page === "user") {
                canvasImage = canvasImage.replace(app.data.regexImageProxy,
                                                  app.data.serverHost + "/api/image-proxy-public/" +
                                                  this.data.user_id + "/" + app.util.getUserApiToken());
            } else {
                canvasImage = canvasImage.replace(app.data.regexImageProxy,
                                                  app.data.serverHost +  "/api/image-proxy/" +
                                                  app.util.getUserApiToken());
            }

            canvasImage = app.util.setSvgViewbox(canvasImage);

            this.$el.find(".divSceneCanvas").empty();
            this.$el.find(".divSceneCanvas").append(canvasImage);

            // Listen for image loading error - if azure isn't connected or whatever
            this.$el.find("image").on("error", function (e) {
                app.util.showToast("Error loading images");
            });
        }
    },




    // resize storyboards when orientation changes
    updateLayout: function () {

        var sceneWidth = $("#divMainContent")[0].offsetWidth  - 20; // - 30;
        var sceneHeight = sceneWidth / 2;

        this.$el.find(".divSceneContent").css({
            "height": sceneHeight + "px"
        });

        this.$el.find(".divSceneContent").css({
            "width": sceneWidth + "px"
        });

        this.$el.find(".divActualText").css({ "max-height": sceneHeight + "px" });
    },



    // Show edit canvas dialog
    editCanvas: function () {
        var self = this;
        var isFullWidth = this.data.type === "canvas" ? true : false;

        $("#divEditSceneContainer").show();
        new app.dialog.view.EditSceneCanvas(this.data.canvas_data_json, isFullWidth,
                                            function (success, canvas_data_svg, canvas_data_json) {
            $("#divEditSceneContainer").hide();
            $("#divEditSceneContainer").empty();
            $("#divEditSceneContainer").unbind();

            if (success === true) {
                // online
                if (app.util.isOfflineMode() === false) {
                    if (success === true) {
                        var data = {
                            scene_id: self.data.scene_id,
                            canvas_data_svg: canvas_data_svg,
                            canvas_data_json: canvas_data_json,
                            api_token: app.util.getUserApiToken()
                        }

                        app.server.updateSceneCanvas(data, function (success) {
                            self.data.canvas_data_json = canvas_data_json;
                            self.data.canvas_data_svg = canvas_data_svg;
                            self.updateCanvas();
                        });
                    }

                // offline
                } else {
                    self.data.canvas_data_json = canvas_data_json;
                    self.data.canvas_data_svg = canvas_data_svg;
                    self.editStoryboard.saveOfflineStoryboard(self.data, function (success) {
                        if (success === true) {
                            self.updateCanvas();
                        }
                    })
                }
            }
        });
    },


    // Show edit text dialog
    editText: function () {
        var self = this;
        $("#divEditSceneContainer").show();
        new app.dialog.view.EditSceneText(this.data.text, function (success, result) {
            $("#divEditSceneContainer").hide();
            $("#divEditSceneContainer").empty();
            $("#divEditSceneContainer").unbind();

            if (success === true) {

                // online
                if (app.util.isOfflineMode() === false) {
                    var data = {
                        scene_id: self.data.scene_id,
                        text: result,
                        api_token: app.util.getUserApiToken()
                    }

                    app.server.updateSceneText(data, function (success) {
                        self.data.text = result;
                        self.$el.find(".divActualText").empty().append(result);
                    });

                // offline
                } else {
                    self.data.text = result;
                    self.editStoryboard.saveOfflineStoryboard(self.data, function (success) {
                        if (success === true) {
                            self.$el.find(".divActualText").empty().append(result);
                        }
                    })
                }
            }
        });
    },

});
