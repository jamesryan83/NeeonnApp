"use strict";

var app = app || {};
app.help = {};
app.help.view = {};


// Help page
app.help.view.Main = Backbone.View.extend({
    el: "#divMainContent",

    template: _.template($("#templateHelp").html()),

    events: {
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    }
});

