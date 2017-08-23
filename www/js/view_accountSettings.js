"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};


// Settings page
app.account.view.Settings = Backbone.View.extend({
    el: "#divMainContent",

    template: _.template($("#templateSettings").html()),

    events: {
        "click #buttonSettingsSave": "updateAccount",
        "click #buttonSettingsLogout": "logout",
        "click #buttonSettingsDisable": "disableAccount",
        "click #buttonSettingsEnable": "enableAccount",
        "click #buttonSettingsDelete": "deleteAccount",
        "click #aChangePassword": "changePassword"
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        var self = this;
        this.$el.html(this.template());

        if (app.util.isOfflineMode() === false) {
            this.showLoadingScreen();

            // Get account details
            app.server.getUserAccountDetails(function (success, result) {
                self.showContent();

                if (success === true) {
                    $("#inputAccountSettingsFullName").val(result.fullname);
                    $("#inputAccountSettingsUsername").val(result.username);
                    $("#inputAccountSettingsEmail").val(result.email);
                    $("#inputAccountSettingsWebsite").val(result.website);
                    $("#inputAccountSettingsLocation").val(result.location);
                    $("#inputAccountSettingsSummary").val(result.summary);

                    if (result.is_active == 1) {
                        $("#buttonSettingsDisable").show();
                        $("#buttonSettingsEnable").hide();
                    } else if (result.is_active == 0) {
                        $("#buttonSettingsDisable").hide();
                        $("#buttonSettingsEnable").show();
                    } else {
                        $("#buttonSettingsDisable").hide();
                        $("#buttonSettingsEnable").hide();
                    }

                } else {
                    // TODO : do something
                }
            });
        } else {
            this.showOfflineMessage();
        }

        return this;
    },


    // show change password dialog
    changePassword: function () {
        var self = this;

        $("#divDialogContainer").show();
        new app.dialog.view.ChangePassword(function (success, data) {
            app.util.hideDialog();

            if (success === true) {
                self.showLoadingScreen();

                // add api token
                data.api_token = app.util.getUserApiToken();

                // send data to server
                app.server.changePassword(data, function (success2, result) {
                    self.showContent();

                    if (success2 === true) {
                        app.util.showToast("Password Successfully Changed");
                    } else {
                        app.util.showToast("Error changing password");
                    }
                });
            }
        });
    },


    // enable account
    enableAccount: function () {
        app.server.enableAccount(function (success, result) {
            if (success === true) {
                location.reload();
            }
        });
    },


    // disable account
    disableAccount: function () {
        app.server.disableAccount(function (success, result) {
            if (success === true) {
                location.reload();
            }
        });
    },


    // Update account
    updateAccount: function () {
        var data = {
            fullname: $("#inputAccountSettingsFullName").val(),
            username: $("#inputAccountSettingsUsername").val(),
            email: $("#inputAccountSettingsEmail").val(),
            website: $("#inputAccountSettingsWebsite").val(),
            location: $("#inputAccountSettingsLocation").val(),
            summary: $("#inputAccountSettingsSummary").val(),
            api_token: app.util.getUserApiToken()
        }

        // Validate inputs
        if (data.username.length < 3) {
            app.util.showToast("Username must be at least 3 characters");
            return;
        }

        if (data.email.length === 0) {
            app.util.showToast("Email can't be empty");
            return;
        }


        app.server.updateAccount(data, function (success, result) {
            if (success === true) {
                app.util.showToast("Changes Saved");
                location.reload();
            }
        });
    },





    // Logout
    logout: function () {
        app.server.logout(function (success) {
            if (success === true) {
                app.util.deleteFromLocalStorage("api_token");
                app.router.navigate("/", { trigger: true });
            }
        });
    },


    // Delete account
    deleteAccount: function () {
        var self = this;
        var dialogData = {
            heading: "Delete Account",
            text1: "Are you sure you want to delete your account ?",
            text2: "You will lose all your content and it cannot be undone"
        }

        // show delete account dialog
        $("#divDialogContainer").show();
        new app.dialog.view.OkCancel(dialogData, function (result) {
            app.util.hideDialog();

            if (result === true) {
                app.server.deleteAccount(function (success) {
                    if (success === true) {
                        app.util.deleteFromLocalStorage("api_token");
                        app.util.showToast("Account successfully deleted :(");
                        app.router.navigate("/", { trigger: true });
                    }
                });
            }
        });
    },


    // Show the loading thing
    showLoadingScreen: function () {
        $("#divSettingsContent").hide();
        $("#divOfflineMode").hide();
        $("#divLoading").show();
    },


    // Show content
    showContent: function () {
        $("#divSettingsContent").show();
        $("#divOfflineMode").hide();
        $("#divLoading").hide();
    },


    // Show offline message
    showOfflineMessage: function () {
        $("#divSettingsContent").hide();
        $("#divOfflineMode").show();
        $("#divLoading").hide();
    }
});
