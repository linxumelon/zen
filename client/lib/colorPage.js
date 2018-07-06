import {$,jQuery} from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

$(function() {
    var colorLayer    = document.getElementById('colorLayer');
    var lineLayer    = document.getElementById('lineLayer');
    var backUpLayer = document.createElement('canvas');

    var matchOutlineColor = function(r, g, b, a){
        return (r + g + b < 150 && a >= 100);
    };
    //turns non-black pixels to transparent
    var rmWhiteP = function(canvas, ctx, backUpCtx) {
        var pixels = ctx.getImageData(0, 0, 700, 700);
        var pixelsD = pixels.data;
        for (var i = 0; i < pixelsD.length; i+= 4 ){
           var r = pixelsD[i];
           var g = pixelsD[i+1];
           var b = pixelsD[i+2];
           var a = pixelsD[i+3];
           
           if (!matchOutlineColor(r, g, b, a) ){
               pixelsD[i+3] = 0.0;
               console.log(pixelsD[i+3]);
           }
        }
        ctx.putImageData(pixels, 0, 0);
        backUpCtx.putImageData(pixels, 0, 0);
        console.log("ok");
        return ctx;
    }

    colorLayer.setAttribute('width', 700);// px
    colorLayer.setAttribute('height', 700);// px
    colorLayer.setAttribute('id', 'colorLayer');
    lineLayer.setAttribute('width', 700);// px
    lineLayer.setAttribute('height', 700);// px
    lineLayer.setAttribute('id', 'lineLayer');
    backUpLayer.setAttribute('width', 700);// px
    backUpLayer.setAttribute('height', 700);// px

    var colorContext = colorLayer.getContext("2d");
    var lineContext = lineLayer.getContext("2d");
    var backUpContext = backUpLayer.getContext("2d");
    var colorLayerData;
    var lineLayerData;
    var backUpContext;

    //imports template png to line layer
    var templateImage = new Image();
    templateImage.src = FlowRouter.getQueryParam("image");

    templateImage.onload = function() {
      console.log("loaded");
        colorContext.drawImage(templateImage, 0, 0);
        lineContext.drawImage(templateImage, 0, 0);
        lineContext = rmWhiteP(lineLayer, lineContext, backUpContext);
        try {
            // lineLayerData = lineContext.getImageData(0, 0, 700, 700);
            colorLayerData = colorContext.getImageData(0, 0, 700, 700);
        } catch (ex) {

        }
        resourceLoaded();
    };

    function resourceLoaded() {
        redraw();
    }

    var mode = "brush"; //"fill" is fill mode, "dropper" is eyedropper
    var lineWidth = 50;
    var opacity = 100; //percent
    var color = "#df4b26";
    var paint = false;
    var layer = colorContext;


    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var clickMode = new Array();
    var clickColor = new Array();
    var clickSize = new Array();
    var clickOpacity = new Array();
    var clickCtx = new Array();

    var redoX = new Array();
    var redoY = new Array();
    var redoDrag = new Array();
    var redoMode = new Array();
    var redoColor = new Array();
    var redoSize = new Array();
    var redoOpacity = new Array();
    var redoCtx = new Array();
    
    
    $('#lineLayer').mousedown(function(e){
      var mouseX = e.pageX - $('#lineLayer').offset().left;
      var mouseY = e.pageY - $('#lineLayer').offset().top;
      function dropperHelper(ctx) {
        var p = ctx.getImageData(mouseX, mouseY, 1, 1).data;
        var hex = ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        $('#colorPicker').colpickSetColor(hex,true); //using colpick      
      }
         
      if (mode === "brush") {          
        paint = true;
        addClick(e.pageX - $('#lineLayer').offset().left, e.pageY - $('#lineLayer').offset().top, layer);
        redraw();
      } else if (mode === "dropper") {
        dropperHelper(layer);
      } else if (mode === "fill") {
        addClick(mouseX, mouseY, false, layer);
        redraw();
      }
    });
    
    $('#lineLayer').mousemove(function(e){
        
      if(paint){
        var coordinateX = e.pageX - $('#lineLayer').offset().left;
        var coordinateY = e.pageY - $('#lineLayer').offset().top; 

        addClick(coordinateX, coordinateY, true, layer);
        redraw();
        }
    });

    $('#lineLayer').mouseup(function(e){
      paint = false;
    });

    
    
    

    function addClick(x, y, dragging, layer) {
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
      clickColor.push(color);
      clickMode.push(mode);
      clickSize.push(lineWidth);
      clickOpacity.push(opacity);
      clickCtx.push(layer);
      redoX = [];
      redoY = [];
      redoMode = [];
      redoDrag = [];
      redoColor = [];
      redoSize = [];
      redoOpacity = [];
      redoCtx = [];
    }

    function redraw(){
      colorContext.clearRect(0, 0, 700, 700);
      colorContext.drawImage(templateImage, 0, 0);
      colorContext.lineJoin = "round";
      lineContext.clearReact(0, 0, 700, 700);
      lineContext.drawImage(backUpLayer, 0, 0);
      lineContext.lineJoin = "round";
      
      function brushHelper(layer) {
        layer.beginPath();
        layer.globalAlpha = clickOpacity[i] / 100;
        if(clickDrag[i] && i){
          layer.moveTo(clickX[i-1], clickY[i-1]);
         }else{
           layer.moveTo(clickX[i]-1, clickY[i]);
         }
         layer.lineTo(clickX[i], clickY[i]);
         layer.closePath();
         layer.strokeStyle = clickColor[i];
         layer.lineWidth = clickSize[i];
         layer.stroke();
      }
      for(var i=0; i < clickX.length; i++) {  
        if (clickMode[i] === "brush") {
          brushHelper(layer);
        } else if (clickMode[i] === "fill") {
          floodFill(clickX[i], clickY[i], clickColor[i]);
        }   
        
      }
      colorContext.globalAlpha = 1;
      lineContext.globalAlpha = 1;
    }
    
    // function floodFill(x, y, color) {
    //   var stack = [[x, y]];

    //   var rgb = hexToRgb(color);
    //   var r = rgb.r;  
    //   var g = rgb.g;
    //   var b = rgb.b;
  
    //   while (stack.length) {
    //     var current = stack.pop();
    //     var curX = current[0];
    //     var curY = current[1];
    //     var pixelPos = (curY * 700 + curX) * 4;
    //     console.log(notLine(pixelPos));
        /*
        if (curX >= 0 && curX <= 700 && 
            curY >= 0 && curY <= 700 && 
            notLine(pixelPos)) {
          //color the pixel
          console.log(pixelPos);
          colorLayerData.data[pixelPos] = r;
          console.log("fef");
          colorLayerData.data[pixelPos + 1] = g;
          colorLayerData.data[pixelPos + 2] = b;
          colorContext.putImageData(colorLayerData, curX, curY);
          console.log(r);
          stack.push([curX + 1 , curY]);
          stack.push([curX, curY + 1]);
          stack.push([curX - 1, curY]);
          stack.push([curX, curY - 1]);
        } else {
          console.log("end");
        }*/
    //   }

    // }
    
    function notLine(pos) {
      var r = lineLayerData.data[pos];
      var g = lineLayerData.data[pos + 1];
      var b = lineLayerData.data[pos + 2];

      if (r + g + b === 0) { // transparent
        console.log('true');
        return true;
      } else {
        console.log('false');
        return false;
      }
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


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
        color: 'df4b26',
        flat: true,
        layout: 'hex',
        colorScheme: 'dark',
        submit: false,
        onChange: function(hsb,hex,rgb,el,bySetColor) {
            var hexWithHex = '#' + hex;
            $('#colorPicker').val(hexWithHex);
            color = hexWithHex;
        }
    });

    $('#button-brush').click(function() {
        mode = "brush";
    });

    $('#button-fill').click(function() {
        mode = "fill";
    });

    $('button-line-layer').click(function() {
        layer = "line";
    });

    $('button-color-layer').click(function() {
        layer = "color";
    });

    $('#button-eyedrop').click(function() {    
      mode = "dropper";
    });
        
    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255) {
            throw "Invalid color component";
        }    
        return ((r << 16) | (g << 8) | b).toString(16);
    }    

    $('#button-undo').click(function() {
      undo();
      function undo() {
        redoX.push(clickX.pop());
        redoY.push(clickY.pop());
        var drag = clickDrag.pop();
        redoDrag.push(drag);
        redoMode.push(clickMode.pop());
        redoColor.push(clickColor.pop());
        redoSize.push(clickSize.pop());
        redoOpacity.push(clickOpacity.pop());
        redoCtx.push(clickCtx.pop());
        
        if (drag) {
          undo();
        } else {
          return;
        }
      }
    
        redraw();
     
    });

    $('#button-redo').click(function() {
      redo();
      function redo() {
        clickX.push(redoX.pop());
        clickY.push(redoY.pop());
        var drag = redoDrag.pop();
        clickDrag.push(drag);
        clickMode.push(redoMode.pop());
        clickColor.push(redoColor.pop());
        clickSize.push(redoSize.pop());
        clickOpacity.push(redoOpacity.pop());
        clickCtx.push(redoCtx.pop());
        if (redoDrag.length > 0 && redoDrag[redoDrag.length - 1]) {
          redo();
        } else {
          return;
        }
      }
    
        redraw();
        
    });

    $('#button-zoom-in').click(function() {

    });

    $('#button-zoom-in').click(function() {

    });

    $('#sizeSlide').slider({
      min: 1,
      max: 100,
      value: 50,
      change: function(event, ui) {
        lineWidth = ui.value;
      }
    });
    
    $('#opacitySlide').slider({
      min: 1,
      max: 100,
      value: 100,
      change: function(event, ui) {
        opacity = ui.value;
      }
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
          // mask = MagicWand.floodFill(image, downPoint.x, downPoint.y, currentThreshold);
          mask = MagicWand.gaussBlurOnlyBorder(mask, blurRadius);
          masks.push(mask);
          cacheInds.push(MagicWand.getBorderIndices(mask));
          drawBorder(true);
        }
      };

      

      var checkOutLine = function() {
          
      }
      
      var colorPixel =  function (pixelPos, r, g, b, a) {
        
      }
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
