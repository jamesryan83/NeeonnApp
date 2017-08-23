"use strict";

var app = app || {};
app.search = {};
app.search.view = {};

// Search page
app.search.view.Main = Backbone.View.extend({
    el: "#divMainContent",

    template: _.template($("#templateSearch").html()),

    events: {
        "click #buttonSearchStoryboard": "showSearchDialog",
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());

        this.currentPage = 1;

        if (app.util.isOfflineMode() === false) {
            this.showLoading();

            this.search({
                searchTerm: "",
                category: "All Categories",
                sortBy: "Latest",
                searchTitles: true,
                searchUsernames: false,
                searchText: false,
                selectedPage: this.currentPage,
                api_token: app.util.getUserApiToken()
            });
        } else {
            this.$el.find("#buttonSearchStoryboard").hide();
            this.showOfflineMode();
        }

        return this;
    },

    // Show search dialog
    showSearchDialog: function () {
        var self = this;

        $("#divDialogContainer").show();
        new app.dialog.view.Search(function (success, result) {
            app.util.hideDialog();
            if (success === true) {
                result.selectedPage = this.currentPage;
                self.search(result);
            }
        });
    },


    // Search
    search: function (data) {
        var self = this;

        $("#divStoryboards").off("scroll");

        this.showLoading();

        data.api_token = app.util.getUserApiToken();

        // get search results from server
        app.server.search(data, function (success, result) {

            if (success === true) {

                // show no results message
                if (result === null || result.length === 0 || result.storyboards === undefined ||
                    result.storyboards === null || result.storyboards.length === 0) {

                    if (self.$el.find("#divStoryboards").children().length <= 1) {
                        self.showNoStoryboards();
                    } else {
                        self.showStoryboards();
                    }

                // append new results
                } else {

                    self.currentPage = result.selectedPage;

                    var i = 0;
                    var j = 0;

                    // insert scenes into their storyboards
                    if (result.scenes !== undefined && result.scenes !== null && result.scenes.length > 0)
                    for (i = 0; i < result.storyboards.length; i++) {
                        result.storyboards[i].scenes = [];

                        for (j = 0; j < result.scenes.length; j++) {
                            if (result.storyboards[i].storyboard_id === result.scenes[j].storyboard_id)
                            result.storyboards[i].scenes.push(result.scenes[j]);
                        }
                    }

                    // append storyboards to search
                    for (i = 0; i < result.storyboards.length; i++) {
                        self.$el.find("#divStoryboards")
                            .append(new app.items.view.StoryboardItem("search", result.storyboards[i]).el);
                    }

                    self.showStoryboards();


                    // setup infinite scroll.  when scroll hits bottom, do another search and append data
                    $("#divStoryboards").on("scroll", function() {
                         if ($("#divStoryboards")[0].scrollHeight === ($("#divStoryboards").scrollTop() + $("#divStoryboards")[0].offsetHeight)) {
                             data.selectedPage = parseInt(data.selectedPage) + 1;
                             self.search(data);
                         }
                    });
                }
            }
        });
    },


    // Show storyboards
    showStoryboards: function () {
        this.$el.find("#divStoryboards").show();
        this.$el.find("#divLoading").hide();
        this.$el.find("#divNoStoryboards").hide();
        this.$el.find("#divOfflineMode").hide();
    },



    // Hide storyboards (when there's none to show)
    showLoading: function () {
        this.$el.find("#divStoryboards").hide();
        this.$el.find("#divLoading").show();
        this.$el.find("#divNoStoryboards").hide();
        this.$el.find("#divOfflineMode").hide();
    },


    // Show no storyboards message
    showNoStoryboards: function () {
        this.$el.find("#divStoryboards").hide();
        this.$el.find("#divLoading").hide();
        this.$el.find("#divNoStoryboards").show();
        this.$el.find("#divOfflineMode").hide();
    },


    // Show offline mode message
    showOfflineMode: function () {
        this.$el.find("#divStoryboards").hide();
        this.$el.find("#divLoading").hide();
        this.$el.find("#divNoStoryboards").hide();
        this.$el.find("#divOfflineMode").show();
    },

});

