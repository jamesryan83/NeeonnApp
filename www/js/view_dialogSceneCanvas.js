"use strict";

var app = app || {};
app.dialog = app.dialog || {};
app.dialog.view = app.dialog.view || {};


// Edit scene canvas dialog
app.dialog.view.EditSceneCanvas = Backbone.View.extend({

    el: "#divEditSceneContainer",

    template: _.template($("#templateDialogEditSceneCanvas").html()),

    events: {
        "click .divCanvasButtonDelete": function () { this.canvasAction("delete"); },
        "click .divCanvasButtonSelect": function () { this.canvasAction("select"); },
        "click .divCanvasButtonSketch": function () { this.canvasAction("sketch"); },
        "click .divCanvasButtonText": function () { this.canvasAction("text"); },
        "click .divCanvasButtonPicture": function () { this.canvasAction("picture"); },
        "click .divCanvasButtonUndo": function () { this.canvasAction("undo"); },
        "click .divCanvasButtonRedo": function () { this.canvasAction("redo"); },
        "click .divCanvasButtonMoveDown": function () { this.canvasAction("moveDown"); },
        "click .divCanvasButtonMoveUp": function () { this.canvasAction("moveUp"); },
        "click .divCanvasButtonClear": function () { this.canvasAction("clear"); },
        "change .selectPathThickness": "setPathThickness",
        "click #divSaveButton": "save",
        "click #divCloseButton": "close",
    },


    initialize: function (canvas_data_json, isFullWidth, callback) {
        var self = this;

        this.canvas_data_json = canvas_data_json;
        this.isFullWidth = isFullWidth;

        this.canvasSelectedColor = app.util
            .loadFromLocalStorage("canvasSelectedColor") || app.data.colorNeonPink;
        this.canvasIsRedoing = false;
        this.canvasItems = []; // TODO : update when items loaded from server
        this.callback = callback;
        this.scaleFactor = 1;
        this.canvas = null;


        if (this.canvas_data_json !== null) {
            this.canvas_data_json = this.canvas_data_json.replace(app.data.regexImageProxy,
                                          app.data.serverHost +  "/api/image-proxy/" +
                                          app.util.getUserApiToken());
        }

        this.render();


        // after render is finished
        setTimeout(function () {

            // setup canvas
            self.canvas = new fabric.Canvas("canvasMain");
            self.canvas.selection = true;
            self.canvas.freeDrawingBrush.width = 5;
            self.canvas.freeDrawingBrush.color = app.data.colorNeonPink;

            // object added to canvas event
            self.canvas.on('object:added', function(e) {
                // change default selection handles
                // options -> http://fabricjs.com/docs/fabric.Object.html
                e.target.set({
                    borderColor: app.data.colorNeonPink,
                    cornerColor: app.data.colorNeonPink,
                    cornerSize: 8,
                    padding: 3,
                    rotatingPointOffset: 20,
                    hoverCursor: "pointer",
                    transparentCorners: false
                });


                // for undo/redo
                // http://codepen.io/keerotic/pen/yYXeaR
                if (self.canvasIsRedoing === false) {
                    self.canvasItems = [];
                }
                self.canvasIsRedoing = false;
            });


            self.updateCanvas(true);
        }, 0);


        // on appResized event
        app.events.on("appResized", function () {
            self.updateLayout();
        })
    },



    render: function() {
        this.$el.html(this.template());
        var self = this;
        this.updateLayout();

        // setup canvas color picker
        $("#inputSceneColorPicker").spectrum({
            showPalette: true,
            showAlpha: true,
            color: self.canvasSelectedColor,
            clickoutFiresChange: false,
            show: function () {
                // event to select same color when choose is clicked
                // (instead of change event which doesn't fire when same color is picked)
                $("body > .sp-container").find(".sp-choose").on("click.myChooseClick", function () {
                    self.updateSelectedColor($("#inputSceneColorPicker").spectrum("get").toHexString());
                });
            },
            hide: function () {
                $("body > .sp-container").find(".sp-choose").off("click.myChooseClick");
            }
        });



    },



    // set contentArea height
    updateLayout: function () {

        var contentAreaHeight = $("#divAppContainer")[0].offsetHeight - 80;
        var fullWidth = $("#divAppContainer")[0].offsetWidth;

        this.$el.find("#divEditSceneContent").css({ "height": contentAreaHeight });

        var canvasWidth;
        var canvasHeight;

        // portrait
        if (contentAreaHeight > fullWidth) {

            canvasWidth = fullWidth;
            canvasHeight = this.isFullWidth ? fullWidth / 2 : fullWidth;

            this.$el.find("#divCanvas").css({
                "border-top": "2px solid #eaeaea",
                "border-bottom": "2px solid #eaeaea",
                "border-left": "none",
                "border-right": "none",
                "height": canvasHeight,
                "width": canvasWidth
            });

            this.$el.find("#canvasMain").attr("width", canvasWidth);
            this.$el.find("#canvasMain").attr("height", canvasHeight);

        // landscape
        } else {

            if (this.isFullWidth === true) {
                if (contentAreaHeight * 2 < fullWidth) {
                    canvasHeight = contentAreaHeight;
                    canvasWidth = contentAreaHeight * 2;
                } else {
                    canvasHeight = fullWidth / 2;
                    canvasWidth = fullWidth;
                }
            }

            this.$el.find("#divCanvas").css({
                "border-top": "none",
                "border-bottom": "none",
                "border-left": "2px solid #eaeaea",
                "border-right": "2px solid #eaeaea",
                "height": canvasHeight,
                "width": canvasWidth
            });

            this.$el.find("#canvasMain").attr("width", canvasWidth);
            this.$el.find("#canvasMain").attr("height", canvasHeight);
        }

        if (this.canvas !== null) {

            this.canvas.setWidth(canvasWidth);
            this.canvas.setHeight(canvasHeight);
            this.canvas.calcOffset();
            this.updateCanvas();
        }
    },



    // update canvas on start or screen orientation change
    updateCanvas: function (isStartup) {

        // scale to original size first
        this.scaleCanvasToOriginalSize();

        // update data before rescaling, but not on startup
        if (!isStartup) {
            this.canvas_data_json = JSON.stringify(this.canvas);
        }


        // Work out scale factor for canvas objects
        var canvasHeight = this.$el.find("#divCanvas")[0].offsetHeight;
        this.scaleFactor = canvasHeight / app.data.webCanvasHeight; // x & y factors are the same


        // load existing canvas data
        if (this.canvas_data_json !== null && this.canvas_data_json.length > 0) {

            var canvasImageParsed = JSON.parse(this.canvas_data_json);

            // scale background image if it exists
            if (canvasImageParsed.backgroundImage !== undefined &&
                    canvasImageParsed.backgroundImage.width !== undefined) {
                canvasImageParsed.backgroundImage.width *= this.scaleFactor;
                canvasImageParsed.backgroundImage.height *= this.scaleFactor;
            }

            // maybe need to scale other stuff too (strokeWidth ??)
            this.canvas.loadFromJSON(canvasImageParsed, this.canvas.renderAll.bind(this.canvas));

            // scale objects to fit canvas
            var obj = this.canvas.getObjects();
            for (var i = 0; i < obj.length; i++) {
                obj[i].set("scaleX", obj[i].get("scaleX") * this.scaleFactor);
                obj[i].set("scaleY", obj[i].get("scaleY") * this.scaleFactor);
                obj[i].set("left", obj[i].get("left") * this.scaleFactor);
                obj[i].set("top", obj[i].get("top") * this.scaleFactor);
                obj[i].setCoords();
            }

            this.canvas.renderAll();
        }
    },


    // scale objects back up again to proper website size
    scaleCanvasToOriginalSize: function () {
        if (this.scaleFactor === 1) {
            return;
        }

        var webWidth = this.isFullWidth === true ? app.data.webCanvasWidth : app.data.webCanvasWidthHalf;
        var tempFactor = 1 / this.scaleFactor;
        var obj = this.canvas.getObjects();

        for (var i = 0; i < obj.length; i++) {
            obj[i].set("scaleX", obj[i].get("scaleX") * tempFactor);
            obj[i].set("scaleY", obj[i].get("scaleY") * tempFactor);
            obj[i].set("left", obj[i].get("left") * tempFactor);
            obj[i].set("top", obj[i].get("top") * tempFactor);
            obj[i].setCoords();
        }

        if (this.canvas.backgroundImage !== null) {
            this.canvas.backgroundImage.width = webWidth;
            this.canvas.backgroundImage.height = app.data.webCanvasHeight;
        }

        this.canvas.renderAll();
    },



    // save text & canvas to object and close dialog
    save: function () {

        this.scaleCanvasToOriginalSize();
        var webWidth = this.isFullWidth === true ? app.data.webCanvasWidth : app.data.webCanvasWidthHalf;

        // resize canvas svg to original size
        var tempSvg = this.canvas.toSVG();
        var canvasXml = $.parseXML(tempSvg);

        $(canvasXml).find("svg").attr("width", webWidth);
        $(canvasXml).find("svg").attr("height", app.data.webCanvasHeight);
        tempSvg = (new XMLSerializer()).serializeToString(canvasXml);

        var canvas_data_svg = tempSvg;
        var canvas_data_json = JSON.stringify(this.canvas);


        app.util.addToLocalStorage("canvasSelectedColor", this.canvasSelectedColor);
        this.callback(true, canvas_data_svg, canvas_data_json);
    },


    // close without saving
    close: function () {
        this.callback(false)
    },








    // ----------------------------------- Canvas -----------------------------------


    // canvas actions
    canvasAction: function (action) {
        var self = this;

        if (action !== "delete") {
            this.canvas.isDrawingMode = false;
        }

        var selectedObject = this.canvas.getActiveObject();
        var newObject = null;

        switch (action) {
            case "select":
                return;

            case "sketch":
                this.canvas.isDrawingMode = true;
                break;

            case "text":
                newObject = new fabric.IText("Text", {
                    fontSize: 20,
                    fontFamily: "open-sans, Helvetica Neue, Helvetica, Arial, sans-serif",
                    fill: this.canvasSelectedColor
                });
                break;

            case "picture":
                this.addPictureToCanvas();
                break;

            case "moveDown":
                if (selectedObject !== undefined && selectedObject !== null) {
                    selectedObject.sendBackwards();
                }
                break;

            case "moveUp":
                if (selectedObject !== undefined && selectedObject !== null) {
                    selectedObject.bringForward();
                }
                break;

            case "delete":
                if (selectedObject !== undefined && selectedObject !== null) {
                    this.canvas.remove(selectedObject);
                }
                break;

            case "clear":
                this.clearCanvas();
                break;

            case "undo":
                if (this.canvas._objects.length > 0) {
                    this.canvasItems.push(this.canvas._objects.pop());
                    this.canvas.renderAll();
                }
                break;

            case "redo":
                if (this.canvasItems.length > 0) {
                    this.canvasIsRedoing = true;
                    this.canvas.add(this.canvasItems.pop());
                }
                break;
        }


        // setup newObject and add to canvas
        if (newObject !== undefined && newObject !== null) {
            this.canvas.add(newObject);
        }
    },




    // set sketch path thickness
    setPathThickness: function () {
        this.canvas.freeDrawingBrush.width = this.$el.find(".selectPathThickness").val();
    },


    // Set the selected color and change color of selected obejct
    updateSelectedColor: function (color) {
        this.canvasSelectedColor = color;
        this.canvas.freeDrawingBrush.color = color;

        // update fill of selected object
        var selectedObject = this.canvas.getActiveObject();
        if (selectedObject !== undefined && selectedObject !== null) {
            // for free draw, change stroke and not fill
            if (selectedObject.fill === null) {
                selectedObject.set("stroke", color);
            } else {
                selectedObject.set("fill", color);
            }

            this.canvas.renderAll();
        }
    },


    // add picture to canvas
    addPictureToCanvas: function () {
        var self = this;



        // show add image dialog
        $("#divDialogContainer").show();
        new app.dialog.view.AddImage(function (success, result, urlPath) {
            app.util.hideDialog();

            if (success === true) {

                // add image from gallery
                if (result === "fromGallery") {

                    // debug
//                    self.canvas.setBackgroundImage("res/turtle.jpg",
//                            self.canvas.renderAll.bind(self.canvas), {
//                        width: $("#divCanvas")[0].offsetWidth,
//                        height: $("#divCanvas")[0].offsetHeight,
//                        backgroundImageStretch: false
//                    });


                    var targetWidth = self.isFullWidth ? 2048 : 1024;

                    // show gallery
                    app.utilAndroid.selectPhoto(targetWidth, function (success2, path) {
                        if (success2 === true) {

                            // show cropping dialog
                            $("#divDialogContainer").show();
                            new app.dialog.view.EditImage(self.isFullWidth, path, function (success) {
                                app.util.hideDialog();

                                if (success === true) {

                                    // get path in photos folder
                                    var imagePath = cordova.file.externalRootDirectory + "Neeonn/photos/" +
                                        app.util.getFilenameFromImageUrl(path);

                                    // add to canvas as unselectable background image
                                    self.canvas.setBackgroundImage(imagePath,
                                            self.canvas.renderAll.bind(self.canvas), {
                                        width: $("#divCanvas")[0].offsetWidth,
                                        height: $("#divCanvas")[0].offsetHeight,
                                        backgroundImageStretch: false
                                    });
                                }
                            });

                        } else {
                            alert("Error opening file from gallery");
                        }
                    });


                // from url - online only
                } else if (result === "fromUrl") {

                    // TODO
                    console.log(urlPath)

                // remove existing image
                } else if (result === "removeImage") {
                    self.canvas.backgroundImage = null;
                    self.canvas.renderAll();
                }
            }
        });


    },






    // Remove all items from canvas
    clearCanvas: function () {
        var self = this;

        var dialogData = {
            heading: "Clear Canvas",
            text1: "Are you sure you want to clear the canvas ?",
            text2: "It cannot be undone"
        }

        $("#divDialogContainer").show();
        new app.dialog.view.OkCancel(dialogData, function (result) {
            app.util.hideDialog();

            if (result === true) {
                self.canvas.clear();
                self.canvas.backgroundColor = null;
                self.canvas.backgroundImage = null;
                self.canvas.renderAll();
            }
        });
    },
});
