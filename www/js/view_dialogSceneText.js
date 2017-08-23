"use strict";

var app = app || {};
app.dialog = app.dialog || {};
app.dialog.view = app.dialog.view || {};

// TODO : add color picker

// Edit scene text dialog
app.dialog.view.EditSceneText = Backbone.View.extend({

    el: "#divEditSceneContainer",

    template: _.template($("#templateDialogEditSceneText").html()),

    events: {
        "click #divTextContainer": "focusTextArea",
        "click #divActualText": "showTextControls",
        "click #divSaveButton": "save",
        "click #divCloseButton": "close",
    },


    initialize: function (data, callback) {
        var self = this;
        this.callback = callback;

        this.render(data);

        // after render is finished
        setTimeout(function () {
            self.startCkEditor();
        }, 0);

        // on appResized event
        app.events.on("appResized", function () {
            self.updateLayout();
        })
    },



    render: function(data) {
        this.$el.html(this.template());

        this.$el.find("#divActualText").append($(data));

        this.updateLayout();
    },


    // set contentArea height
    updateLayout: function () {
        var fullHeight = $("#divAppContainer")[0].offsetHeight;
        this.$el.find("#divEditSceneContent").css({ "height": fullHeight - 80 });
    },


    // save text & canvas to object and close dialog
    save: function () {
        this.callback(true, this.$el.find("#divActualText").html());
    },


    // close without saving
    close: function () {
        this.callback(false)
    },


    // ----------------------------------- Text Editor -----------------------------------


    // Focus on contenteditable when parent div is clicked
    focusTextArea: function (e) {
        if ($("#divActualText").is(":focus") === false) {
            this.$el.find("#divActualText").focus();
        }
    },


    // Shows the CKeditor thing
    startCkEditor: function () {
        var self = this;

        // add editor
        CKEDITOR.disableAutoInline = true;
        var editor = CKEDITOR.inline("divActualText", {
            removePlugins: "floatingspace,maximize,resize",
            sharedSpaces: {
                top: "divEditorTop",
                bottom: "divEditorBottom"
            }
        });

        // editor loaded
        editor.on("instanceReady", function () {
            app.util.placeCaretAtEnd(self.$el.find("#divActualText")[0]);
        });
    },
});
