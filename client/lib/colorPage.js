import {$,jQuery} from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

$(function() {
    var canvas    = document.querySelector('canvas');
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

    /*var colorThreshold = 15;
    var blurRadius = 5;
    var simplifyTolerant = 0;
    var simplifyCount = 30;
    var hatchLength = 4;
    var hatchOffset = 0;
    var imageInfo = {
        width: 700,
        height: 700,
        context: canvas.getContext("2d")
      };       
    var cacheInd = null;
    var cacheInds = [];    
    var downPoint = null;
    var mask = null;
    var masks = [];
    var allowDraw = false;
    var currentThreshold = colorThreshold;
    canvas.width = imageInfo.width;
    canvas.height = imageInfo.height;
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = imageInfo.width;
    tempCanvas.height = imageInfo.height;
    tempCtx.drawImage(src, 0, 0);
    imageInfo.data = tempCtx.getImageData(0, 0, imageInfo.width, imageInfo.height).data;
*/
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
        $('canvas').on('click', function (e) {
            var p = $(e.target).offset();
            var x = Math.round((e.clientX || e.pageX) - p.left);
            var y = Math.round((e.clientY || e.pageY) - p.top);    
            downPoint = { x: x, y: y };    
            magic();
        });

        var magic = function () {
        if (imageInfo) {
          var image = {
            data: imageInfo.data,
            width: imageInfo.width,
            height: imageInfo.height,
            bytes: 4
          };
          mask = MagicWand.floodFill(image, downPoint.x, downPoint.y, currentThreshold);
          mask = MagicWand.gaussBlurOnlyBorder(mask, blurRadius);
          masks.push(mask);
          cacheInds.push(MagicWand.getBorderIndices(mask));
          drawBorder(true);
        }
      };
      
      var drawBorder = function () {
        if (masks.length) {

          var x, y, k, i, j, m,
              w = imageInfo.width,
              h = imageInfo.height,
              ctx = imageInfo.context,
              imgData = ctx.createImageData(w, h),
              res = imgData.data;
          
          ctx.clearRect(0, 0, w, h);
          
          for (m = 0; m < masks.length; m++) {
            
            cacheInd = cacheInds[m];
            
            for (j = 0; j < cacheInd.length; j++) {
              i = cacheInd[j];
              x = i % w; // calc x by index
              y = (i - x) / w; // calc y by index
              k = (y * w + x) * 4; 
              if ((x + y + hatchOffset) % (hatchLength * 2) < hatchLength) { 
                // detect hatch color 
                res[k + 3] = 255; // black, change only alpha
              } else {
                res[k] = 255; // white
                res[k + 1] = 255;
                res[k + 2] = 255;
                res[k + 3] = 255;
              }
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }
      };

      setInterval(function () {
        hatchOffset = (hatchOffset + 1) % (hatchLength * 2);
        drawBorder();
      }, 100);
    });

    $('#button-deselect').click(function() {
        mask = null;
        masks = [];
        cacheInds = [];
    });

    $('#button-save').click(function() {
        var format = 'png';
        var callback = function(/* data url of exported image */) {
        };
        artCanvas.export(format, callback);
    });
});
