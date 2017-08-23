"use strict";

var app = app || {};
app.main = {};
app.main.view = {};


// Main page - navbar + container for other pages
app.main.view.Main = Backbone.View.extend({
    el: "#divAppContainer",

    template: _.template($("#templateMain").html()),

    events: {
        "click #divButtonCamera": "takePhoto",
        "click #divButtonSearch": function () { this.goToPage("search") },
        "click #divButtonAccount": function () { this.goToPage("account") },
        "click #divButtonHelp": function () { this.goToPage("help") },

        "click #divButtonStoryboards": function () { this.goToPage("storyboards") },
        "click #divButtonGallery": function () { this.goToPage("gallery") },
        "click #divButtonSocial": function () { this.goToPage("social") },
        "click #divButtonSettings": function () { this.goToPage("settings") },

        "click #divButtonEdit": function () { this.editStoryboardAction("edit") },
        "click #divButtonExpand": function () { this.editStoryboardAction("expand") },
        "click #divButtonSave": function () { this.editStoryboardAction("save") },

        "click #divButtonBack": "back"
    },

    initialize: function (page, data) {
        var self = this;
        this.currentPage = page;
        this.currentView = null;

        this.render(data);

        $(window).on("resize", function (e) {
            self.updateScreenHeight();
        })

        setTimeout(function () {
            self.updateScreenHeight();
        })
    },

    render: function (data) {
        this.$el.html(this.template());

        var self = this;

        // Set the current page
        switch (this.currentPage) {
            case "search":
                this.currentView = new app.search.view.Main();
                break;
            case "help":
                this.currentView = new app.help.view.Main();
                break;

            case "account":
            case "storyboards":
                this.currentView = new app.account.view.Storyboards();
                break;
            case "gallery":
                this.currentView = new app.account.view.Gallery();
                break;
            case "social":
                this.currentView = new app.account.view.Social();
                break;
            case "settings":
                this.currentView = new app.account.view.Settings();
                break;

            case "edit-storyboard":
                this.currentView = new app.editStoryboard.view.Main(data);
                break;
        }

        // Set the current page navbar
        switch (this.currentPage) {
            case "search":
            case "help":
                this.$el.find("#divNavBarMain").show();
                this.$el.find("#divNavBarAccount").hide();
                this.$el.find("#divNavBarEditStoryboard").hide();
                break;

            case "account":
            case "storyboards":
            case "gallery":
            case "social":
            case "settings":
                this.$el.find("#divNavBarMain").hide();
                this.$el.find("#divNavBarAccount").show();
                this.$el.find("#divNavBarEditStoryboard").hide();
                break;

            case "edit-storyboard":
                this.$el.find("#divNavBarMain").hide();
                this.$el.find("#divNavBarAccount").hide();
                this.$el.find("#divNavBarEditStoryboard").show();
                break;
        }

        // Set selected navbar button
        var pageNameUpperCase = this.currentPage.charAt(0).toUpperCase() + this.currentPage.slice(1)
        var button = "#divButton" + pageNameUpperCase;
        this.$el.find(button).css({ "background-color": "#2EB4FF" });


        // set page title
        if (pageNameUpperCase === "Edit-storyboard") {
            this.$el.find("#labelPageTitle").text("Edit-Storyboard");
        } else {
            this.$el.find("#labelPageTitle").text(pageNameUpperCase);
        }

        return this;
    },


    // set sizes of divs here, can't use calc in css
    updateScreenHeight: function () {

        var oldHeight = $("#divAppContainer")[0].offsetHeight;

        $("#divAppContainer").css({ "height": "100%", "min-height": "100%" });

        // for when keyboard is open, reset to original height
        if ($("#divAppContainer")[0].offsetHeight < 200) {
            $("#divAppContainer").css({ "height": oldHeight + "px", "min-height": oldHeight + "px" });
            return;
        }


        var orientation = null;
        var fullHeight = $("#divAppContainer")[0].offsetHeight;
        var fullWidth = $("#divAppContainer")[0].offsetWidth;
        var navBarWidth = 50;
        var titleBarHeight = 25;

        orientation = fullWidth > fullHeight ? "landscape" : "portrait";

        $("#divAppContainer, #divDialogContainer")
            .css({ "height": fullHeight + "px", "min-height": fullHeight + "px" });

        if (orientation === "landscape") {
            $("#divContentContainer").css({ "height": "100%", "width": (fullWidth - navBarWidth) + "px"});
            $("#divMainContent").css({ "height": (fullHeight - titleBarHeight) + "px" });
        } else {
            $("#divContentContainer")
                .css({ "height": (fullHeight - navBarWidth) + "px", "width": "100%" });
            $("#divMainContent").css({ "height": (fullHeight - titleBarHeight - navBarWidth) + "px" });
        }

        // fire event for listeners (storyboard items and stuff)
        app.events.trigger("appResized", null);
    },


    // Take a photo
    takePhoto: function () {
        // This activity might be killed after camera is finished
        // onResume will be called with the result in index.js
        app.utilAndroid.takePhoto(function (photoPath) {
            app.fileFolder.movePhotoToAppFolder(photoPath);
        });
    },


    // Go to a page
    goToPage: function (page) {
        app.router.navigate(page, { trigger: true });
    },


    // Do storyboard action when on edit-storyboard page
    editStoryboardAction: function (action) {
        switch (action) {
            case "edit":
                this.currentView.showEditStoryboardDetailsDialog();
                break;
            case "expand":
                this.currentView.showStoryboardFullScreen();
                break;
            case "save":
                this.currentView.saveStoryboard();
                break;
        }
    },


    // Go back
    back: function () {
        app.router.back();
    },



});















// Go to a page with animation
//    goToPage: function (page) {
//
//        var orientationLandscape = false;
//        if ($("#divAppContainer")[0].offsetWidth > $("#divAppContainer")[0].offsetHeight) {
//            orientationLandscape = true;
//        }
//
//
//        if (page === "account") {
//            this.$el.find("#divNavBarMain > div").css({ "background-color": "transparent" });
//            this.$el.find("#divButtonAccount").css({ "background-color": "#2EB4FF" });
//
//            var marginSide;
//            if (orientationLandscape === true) {
//                marginSide = "margin-left";
//            } else {
//                marginSide = "margin-top";
//            }
//
//            $("#divNavBarMain").animate({ [marginSide]: "50px"}, 200, function () {
//                app.router.navigate(page, { trigger: true });
//            })
//        } else {
//            app.router.navigate(page, { trigger: true });
//        }
//
//
//    },
