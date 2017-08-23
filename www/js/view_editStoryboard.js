"use strict";

var app = app || {};
app.editStoryboard = {};
app.editStoryboard.view = {};


// Edit Storyboard page
app.editStoryboard.view.Main = Backbone.View.extend({
    el: "#divMainContent",

    template: _.template($("#templateEditStoryboard").html()),

    events: {
        "click #divButtonAddScene": "addScene",
        "click #divButtonEditMode": "showOverlays",
        "click .divSceneDelete": "deleteScene"
    },


    initialize: function (storyboard_id) {
        var self = this;
        this.storyboard_id = storyboard_id;
        this.data = null;
        this.isOverlaysVisible = false;
        this.render();

        // on appResized event
        app.events.on("appResized", function () {
            self.updateLayout();
        })
    },


    render: function () {
        var self = this;
        this.$el.html(this.template({ storyboard_id: this.storyboard_id }));

        // Setup sortable list
        var sortable = Sortable.create(this.$el.find("#divScenes")[0], {
            handle: ".divSceneHandleContainer",
            animation: 150,
            scroll: true,
            scrollSensitivity: 50,
            onEnd: function (e) {
                var oldItemIndex = $(e.item).find(".divSceneItem").data("index");
                self.swapScenePositions(oldItemIndex);
            }
        });


        // Get storyboard and scenes
        app.server.getStoryboard(this.storyboard_id, function (success, data) {
            if (success === true) {
                self.data = data;

                // Set title
                self.$el.find("#labelStoryboardTitle").text(data.title);


                // add storyboard scenes
                if (self.data.scenes.length > 0) {
                    self.data.scenes = app.util.sortArray(self.data.scenes, "storyboard_index");

                    for (var i = 0; i < self.data.scenes.length; i++) {
                        var item = new app.items.view.SceneItem(self.data.scenes[i], self);
                        $("#divScenes").append(item.el);
                    }
                }

                // set scene color
                if (self.data.scene_color !== undefined && self.data.scene_color !== null) {
                    $("#divScenes").find(".divSceneContent").css({
                        "background-color": self.data.scene_color
                    })
                }
            }
        });

        return this;
    },



    // updates the scene indexes and storyboard data object when scenes are rearranged
    updateSceneIndicies: function () {
        var self = this;

        // update data attributes of scene elements
        this.$el.find(".divSceneItem").each(function (index) {
            $(this).attr("data-index", index);
        });

        // update indicies of storyboard data objects
        for (var i = 0; i < this.data.scenes.length; i++) {
            this.data.scenes[i].storyboard_index = i;
        }
    },


    // update layout on resize
    updateLayout: function () {
        var contentHeight = $("#divMainContent")[0].offsetHeight;
        this.$el.find("#divScenes").css({ "height": (contentHeight - 30) + "px" });
    },




    // ----------------------------------- Menu Actions -----------------------------------

    // show edit storyboard details dialog
    showEditStoryboardDetailsDialog: function () {
        var self = this;

        // show dialog
        $("#divDialogContainer").show();
        new app.dialog.view.EditStoryboardDetails(this.data, function (success, result) {
            app.util.hideDialog();

            if (success === true) {
                self.data.allow_comments = result.allow_comments;
                self.data.category = result.category;
                self.data.is_private = result.is_private;
                self.data.title = result.title;

                var data;
                if (app.util.isOfflineMode() === false) {
                    data= {
                        allow_comments: result.allow_comments,
                        category: result.category,
                        is_private: result.is_private,
                        title: result.title,
                        storyboard_id: self.data.storyboard_id,
                        api_token: app.util.getUserApiToken()
                    }
                } else {
                    data = self.data;
                }

                // save
                app.server.updateStoryboardDetails(data, function (success) {
                    if (success === true) {
                        self.$el.find("#labelStoryboardTitle").text(self.data.title);
                    }
                });
            }
        });
    },



    // Show storyboard full screen
    showStoryboardFullScreen: function () {
        app.utilStoryboard.showFullScreen(this.data);
    },



    // Show scene overlays
    showOverlays: function () {
        this.isOverlaysVisible = !this.isOverlaysVisible;

        if (this.isOverlaysVisible === true) {
            this.$el.find(".divSceneOverlay").show();
        } else {
            this.$el.find(".divSceneOverlay").hide();
        }
    },






    // ----------------------------------- Scene Actions -----------------------------------


    // save storyboard - called from item
    saveOfflineStoryboard: function (sceneData, callback) {
        for (var i = 0; i < this.data.scenes.length; i++) {
            if (this.data.scenes[i].storyboard_index == sceneData.storyboard_index) {
                this.data.scenes[i] = sceneData;
                break;
            }
        }

        app.serverOffline.saveStoryboard(this.data, function (success) {
            callback(success);
        });
    },


    // Add a Scene
    addScene: function () {
        var self = this;

        // show dialog
        $("#divDialogContainer").show();
        new app.dialog.view.AddScene(function (success, type) {
            app.util.hideDialog();

            if (success === true) {

                // online mode adds scene after server call, offline adds before
                var addNewScene = function (scene_id) {
                    var sceneData = {
                        storyboard_id: self.storyboard_id,
                        text: "",
                        canvas_data_json: null,
                        canvas_data_svg: null,
                        type: type,
                        created_at: self.data.created_at,
                        updated_at: self.data.updated_at,
                        user_id: self.data.user_id,
                        scene_id: scene_id
                    };

                    self.data.scenes.push(sceneData);
                    self.$el.find("#divScenes").append(new app.items.view.SceneItem(sceneData, self).el);
                    self.updateSceneIndicies();
                }

                // data
                var data;
                if (app.util.isOfflineMode() === false) {
                    data = {
                        storyboard_id: self.storyboard_id,
                        storyboard_index: self.data.scenes.length,
                        type: type,
                        api_token: app.util.getUserApiToken()
                    }
                } else {
                    addNewScene(null);  // add scene before save
                    data = self.data;
                }

                // save
                app.server.createScene(data, function (success2, scene_id) {
                    if (success2 === true) {
                        if (app.util.isOfflineMode() === false) {
                            addNewScene(scene_id);
                        }
                    }
                });
            }
        });
    },


    // Save when scenes are rearranged
    swapScenePositions: function (oldItemIndex) {
        var self = this;

        // update storyboard data object scene array position
        self.$el.find(".divSceneItem").each(function (index) {
            if ($(this).data("index") === oldItemIndex) {
                app.util.changePositionInArray(self.data.scenes, oldItemIndex, index);
                return false;
            }
        });

        this.updateSceneIndicies();

        // save
        var data;
        if (app.util.isOfflineMode() === false) {
            var sceneIndicies = [];
            for (var i = 0; i < this.data.scenes.length; i++) {
                sceneIndicies.push({
                    "scene_id": this.data.scenes[i].scene_id,
                    "storyboard_index": this.data.scenes[i].storyboard_index,
                });
            }

            data = {
                storyboard_id: this.storyboard_id,
                sceneIndicies: sceneIndicies,
                api_token: app.util.getUserApiToken()
            }
        } else {
            data = this.data;
        }

        app.server.updateSceneIndicies(data, function (success) {
            console.log(success)
        });
    },



    // Delete a scene
    deleteScene: function (e) {
        var self = this;
        var dialogData = {
            heading: "Delete Scene",
            text1: "Are you sure you want to delete this Scene ?",
            text2: ""
        }

        // show dialog
        $("#divDialogContainer").show();
        new app.dialog.view.OkCancel(dialogData, function (success) {
            app.util.hideDialog();
            if (success === true) {

                var storyboard_index = $(e.currentTarget).closest(".divSceneItem").data("index");

                // online mode deletes scene after server call, offline deletes before
                var deleteAScene = function () {
                    self.data.scenes.splice(storyboard_index, 1);
                    $(e.currentTarget).closest(".divSceneItemContainer").remove();
                    self.updateSceneIndicies();
                }

                // data
                var data;
                if (app.util.isOfflineMode() === false) {
                    data = {
                        storyboard_id: self.storyboard_id,
                        storyboard_index: storyboard_index,
                        api_token: app.util.getUserApiToken()
                    }
                } else {
                    deleteAScene(); // delete scene before save
                    data = self.data
                }


                // save
                app.server.deleteScene(data, function (success2) {
                    if (success2 === true) {
                        app.util.showToast("Scene Deleted");

                        if (app.util.isOfflineMode() === false) {
                            deleteAScene();
                        }
                    }
                });
            }
        });
    }

});

