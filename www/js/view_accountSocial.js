"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};


// Social page
app.account.view.Social = Backbone.View.extend({
    el: "#divMainContent",

    template: _.template($("#templateSocial").html()),

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

