"use strict";

var app = app || {};
app.currentView = null;

// App router
app.Router = Backbone.Router.extend({

    initialize: function () {
        this.previousPage = "";
        this.currentPage = "";
    },

    routes: {
        "": "loginRegister",
        "search": "search",
        "account": "storyboards",
        "help": "help",

        "storyboards": "storyboards",
        "gallery": "gallery",
        "social": "social",
        "settings": "settings",

        "edit-storyboard/:storyboard_id": "editStoryboard",
    },

    // called before every route change
    execute: function (next, args, name) {

        // remove previous view
        $("#divAppContainer").empty();
        $("#divAppContainer").unbind();

        //console.log(name)
        this.previousPage = this.currentPage;
        this.currentPage = name;

        app.currentView = null;

        next(args);
    },



    // Hardware or software back button pressed
    back: function () {
        switch (this.currentPage) {
            // exit app
            case "loginRegister":
                navigator.app.exitApp();
                break;

            case "search":
            case "help":
                if (app.util.isOfflineMode() === false) {
                    navigator.app.exitApp();
                } else {
                    app.router.navigate("/", { trigger: true });
                }
                break;

            // back to search page
            case "account":
            case "storyboards":
            case "gallery":
            case "social":
            case "settings":

                app.router.navigate("search", { trigger: true });
                break;

            case "editStoryboard":
                app.router.navigate("storyboards", { trigger: true });
                break;
        }

        // TODO : do dialogs properly
        app.util.hideDialog();
        $("#divEditSceneContainer").hide();
        $("#divEditSceneContainer").empty();
        $("#divEditSceneContainer").unbind();
    },


    // login
    loginRegister: function (data) {
        app.currentView = new app.loginRegister.view.Main();
    },

    // register
    register: function (data) {
        app.currentView = new app.register.view.Main();
    },

    // search
    search: function (data) {
        app.currentView = new app.main.view.Main("search");
    },

    // help
    help: function (data) {
        app.currentView = new app.main.view.Main("help");
    },



    // storyboards
    storyboards: function (data) {
        app.currentView = new app.main.view.Main("storyboards");
    },

    // gallery
    gallery: function (data) {
        app.currentView = new app.main.view.Main("gallery");
    },

    // social
    social: function (data) {
        app.currentView = new app.main.view.Main("social");
    },

    // settings
    settings: function (data) {
        app.currentView = new app.main.view.Main("settings");
    },


    // edit storyboard
    editStoryboard: function (data) {
        app.currentView = new app.main.view.Main("edit-storyboard", data[0]);
    },
});
