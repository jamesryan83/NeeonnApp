"use strict";

var app = app || {};
app.loginRegister = {};
app.loginRegister.view = {};


// Login/Register page
app.loginRegister.view.Main = Backbone.View.extend({
    el: "#divAppContainer",

    template: _.template($("#templateLoginRegister").html()),

    events: {
        "click #buttonLoginRegister": "loginRegister",
        "click #buttonGoToOther": "changePage",
        "click #buttonOfflineMode": "offlineMode"
    },

    initialize: function () {
        var self = this;
        this.isLoginPage = true;

        this.render();

        this.showLoadingScreen();

        // after render
        setTimeout(function () {

            // check if user is logged in
            if (app.util.getUserApiToken() !== null) {
                app.server.isUserLoggedIn(function (success) {
                    if (success === true) {
                        app.router.navigate("search", { trigger: true });
                    } else {
                        self.hideLoadingScreen();
                    }
                });
            } else {
                self.hideLoadingScreen();
            }
        }, 0);
    },

    render: function () {
        this.$el.html(this.template());

        this.changePage(true);

        return this;
    },


    // offline mode
    offlineMode: function () {
        app.util.addToLocalStorage("offlineMode", "yes");
        app.router.navigate("search", { trigger: true });
    },


    // Show loading screen
    showLoadingScreen: function () {
        this.$el.find("#divInputsContainer").hide();
        this.$el.find("#divLoading").show();
    },


    // Hide loading screen
    hideLoadingScreen: function () {
        this.changePage(true);
        this.$el.find("#divInputsContainer").show();
        this.$el.find("#divLoading").hide();
    },


    // Switch between login and register page elements
    changePage: function (keepLayout) {
        if (keepLayout !== true) {
            this.isLoginPage = !this.isLoginPage;
        }

        if (this.isLoginPage === true) {
            $("#divUsername").hide();
            $("#h2LoginRegister").text("Login");
            $("#buttonLoginRegister").text("Login");
            $("#buttonGoToOther").text("Create an Account");
        } else {
            $("#divUsername").show();
            $("#h2LoginRegister").text("Create Account");
            $("#buttonLoginRegister").text("Create Account");
            $("#buttonGoToOther").text("Back to Login");
        }
    },



    // try to login
    loginRegister: function () {
        var self = this;

        var username = $("#inputUsername").val();
        var email = $("#inputEmail").val();
        var password = $("#inputPassword").val();

        // validate inputs
        if (this.isLoginPage === false) {
            if (username.length < 3) {
                app.util.showToast("Username can't be less than 3 characters")
                return;
            }
            if (username.length > 30) {
                app.util.showToast("Username can't be longer than 30 characters")
                return;
            }
        }

        if (email.length < 4) {
            app.util.showToast("Email can't be less than 4 characters")
            return;
        }
        if (email.length > 255) {
            app.util.showToast("Email can't be longer than 255 characters")
            return;
        }
        if (password.length < 6) {
            app.util.showToast("Password must be at least 6 characters")
            return;
        }


        this.showLoadingScreen();

        // Login
        if (this.isLoginPage === true) {
            var data = {
                email: email,
                password: password
            }

            app.server.login(data, function (success, result) {
                if (success === true) {
                    app.util.addToLocalStorage("offlineMode", false);
                    app.util.addToLocalStorage("api_token", result);
                    app.router.navigate("search", { trigger: true });
                } else {
                    app.util.showToast(result.message);
                    self.hideLoadingScreen();
                }
            });

        // Register
        } else {
            var data = {
                username: username,
                email: email,
                password: password
            }

            app.server.register(data, function (success, result) {
                if (success === true) {
                    app.util.addToLocalStorage("offlineMode", false);
                    app.util.addToLocalStorage("api_token", result);
                    app.util.showToast("Account successfully created !");
                    app.router.navigate("search", { trigger: true });
                } else {
                    app.util.showToast(result.message);
                    self.hideLoadingScreen();
                }
            });
        }
    },

});
