"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};


// Gallery page
app.account.view.Gallery = Backbone.View.extend({
    el: "#divMainContent",

    template: _.template($("#templateGallery").html()),

    events: {
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

//    // Go to edit image page
//    editImage: function (e) {
//        var name = $(e.target).data("imgname");
//        this.appendGalleryLoadingItem(true, $(e.target).closest(".divGalleryItem"));
//        Cookies.set("previousPage", "accountGallery");
//        location.href = "/edit-image/" + name;
//    }
});

