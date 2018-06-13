$(function() {
	var canvas    = document.querySelector('canvas');
	var container = canvas.parentNode;
	var width     = 600;  // px
	var height    = 600;  // px

	// Create the instance of ArtCanvas
	var artCanvas = new ArtCanvas(container, canvas, width, height);

	//creates new layer, line layer is 1, color layer is 0
	artCanvas.addLayer(width, height);

	//imports template png to line layer
	artCanvas.selectLayer(1);
	var src = /* image file path */;
	artCanvas.drawImage(src);

	//set to drawing by brush on color layer
	artCanvas.selectLayer(0);
	artCanvas.setMode(ArtCanvas.Mode.HAND);

	var callbacks = {
        drawstart   : function() {},
        drawmove    : function() {},
        drawend     : function() {}
    };

    artCanvas.setCallbacks(callbacks);

    $('#button-brush').click(function() {
    	artCanvas.setMode(ArtCanvas.Mode.HAND);
    });

    $('#button-fill').click(function() {
    	var tinycolor = $('#colorpicker-fill').spectrum('get');
        var color     = new ArtCanvas.Color(tinycolor._r, tinycolor._g, tinycolor._b, tinycolor._a);

        artCanvas.fill(event.originalEvent, artCanvas.getFillStyle());
    });

	$('#button-eyedrop').click(function() {
		artCanvas.setMode(ArtCanvas.Mode.TOOL);
		$('canvas').off('.art-canvas').on('click.art-canvas', function(event) {
			var color = artCanvas.pickColor(event)
			var rgba = color.toString();  // rgba(...)
			var hex = color.toHexString(); // #...
			artCanvas.setFillStyle(rgba);
			artCanvas.setStrokeStyle(rgba);
			colpickSetColor(hex,true); //using colpick

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
