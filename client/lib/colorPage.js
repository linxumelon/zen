import {$,jQuery} from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

$(function() {
    var canvas    = document.querySelector('#theCanvas');
    var container = canvas.parentNode;
    var width     = 700;  // px
    var height    = 700;  // px

    // Create the instance of ArtCanvas
    var artCanvas = new ArtCanvas(container, canvas, width, height);

    //creates new layer, line layer is 1, color layer is 0
    artCanvas.addLayer(width, height);

    //imports template png to line layer
    artCanvas.selectLayer(1);
    var src = FlowRouter.getQueryParam("image");
    artCanvas.drawImage(src);

    //set to drawing by brush on color layer
    artCanvas.selectLayer(0);
    artCanvas.drawImage(src);
    artCanvas.setMode(ArtCanvas.Mode.HAND);

    var callbacks = {
        drawstart   : function() {},
        drawmove    : function() {},
        drawend     : function() {}
    };

    artCanvas.setCallbacks(callbacks);

    $('#colorPicker').colpick({
        color: '123456',
        flat: true,
        layout: 'hex',
        colorScheme: 'dark',
        submit: false,
        onChange: function(hsb,hex,rgb,el,bySetColor) {
            var hexWithHex = '#' + hex;
            $('#colorPicker').val(hexWithHex);
            artCanvas.setStrokeStyle(hexWithHex);
            artCanvas.setFillStyle(hexWithHex);
        }
    });

    $('#button-brush').click(function() {
        artCanvas.setMode(ArtCanvas.Mode.HAND);
    });

    $('#button-fill').click(function() {
        artCanvas.setMode(ArtCanvas.Mode.TOOL);
        $('canvas').off('.art-canvas').on('click.art-canvas', function(event) {
            artCanvas.fill(event.originalEvent, artCanvas.getFillStyle());
        });    
    });

    $('button-line-layer').click(function() {
        artCanvas.selectLayer(1);
    });

    $('button-color-layer').click(function() {
        artCanvas.selectLayer(0);
    });

    $('#button-eyedrop').click(function() {
        var prevMode = artCanvas.getMode();
        artCanvas.setMode(ArtCanvas.Mode.TOOL);
        $('canvas').off('.art-canvas').on('click.art-canvas', function(event) {
            var color = artCanvas.pickColor(event.originalEvent);
            var rgba = color.toString();  // rgba(...)
            var hex = color.toHexString(); // #...
            artCanvas.setFillStyle(rgba);
            artCanvas.setStrokeStyle(rgba);
            $('#colorPicker').colpickSetColor(hex,true); //using colpick

        });
        artCanvas.setMode(prevMode);
    });
        

    $('#button-undo').click(function() {
        if (!artCanvas.undo()) {
            window.alert('Cannot Undo');
        }
    });

    $('#button-redo').click(function() {
        if (!artCanvas.redo()) {
            window.alert('Cannot Redo');
        }
    });

    $('#button-zoom-in').click(function() {

    });

    $('#button-zoom-in').click(function() {

    });

    $('#button-select').click(function() {

    });

    $('#button-deselect').click(function() {

    });

    $('#button-save').click(function() {
        var format = 'png';
        var callback = function(/* data url of exported image */) {
        };
        artCanvas.export(format, callback);
    });
});
