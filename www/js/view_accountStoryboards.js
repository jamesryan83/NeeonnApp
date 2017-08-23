"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};


// Storyboards page
app.account.view.Storyboards = Backbone.View.extend({
    el: "#divMainContent",

    template: _.template($("#templateStoryboards").html()),

    events: {
        "click #buttonCreateStoryboard": "createStoryboard"
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        var self = this;

        this.showLoading();


        // load storyboards
        app.server.getAllStoryboards(function (success, data) {
            self.showStoryboards();

            if (success === true) {
                if (data === null || data.length === 0) {
                    self.showNoStoryboards();
                } else {
                    self.showStoryboards();

                    // append loaded storyboards
                    for (var i = 0; i < data.length; i++) {
                        self.appendStoryboardItem(data[i]);
                    }
                }
            }
        });

        return this;
    },



    // Create a storyboard
    createStoryboard: function () {
        var self = this;

        // Show create storyboard dialog
        $("#divDialogContainer").show();
        new app.dialog.view.CreateStoryboard(function (success, data) {

            if (success === false) {
                app.util.hideDialog();
                return;
            }

            // add api token
            data.api_token = app.util.getUserApiToken();


            // Create storyboard
            app.server.createStoryboard(data, function (success, result) {
                app.util.hideDialog();
                if (success === true) {
                    self.appendStoryboardItem(data);
                }
            });
        });
    },



    // append storyboard item
    appendStoryboardItem: function(data) {
        this.showStoryboards();

        var item = new app.items.view.StoryboardItem("account", data);
        this.$el.find("#divStoryboards").prepend(item.el);
    },


    // remove storyboard item
    deleteStoryboard: function (item) {
        item.remove();

        if (this.$el.find("#divStoryboards").children().length == 0) {
            this.showNoStoryboards();
        }
    },


    // Show storyboards
    showStoryboards: function () {
        this.$el.find("#divStoryboards").show();
        this.$el.find("#divLoading").hide();
        this.$el.find("#divNoStoryboards").hide();
    },



    // Hide storyboards (when there's none to show)
    showLoading: function () {
        this.$el.find("#divStoryboards").hide();
        this.$el.find("#divLoading").show();
        this.$el.find("#divNoStoryboards").hide();
    },


    // Show no storyboards message
    showNoStoryboards: function () {
        this.$el.find("#divStoryboards").hide();
        this.$el.find("#divLoading").hide();
        this.$el.find("#divNoStoryboards").show();
    },



});

