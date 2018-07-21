import {$,jQuery} from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

var debug = false;

$(function() {
    var colorLayer    = document.getElementById('colorLayer');
    var lineLayer    = document.getElementById('lineLayer');
    var backUpLayer = document.createElement('canvas');

    var matchOutlineColor = function(r, g, b, a){
        return (r + g + b < 600 && a >= 40);
    };
    //turns non-black pixels to transparent
    var rmWhiteP = function(canvas, ctx, pixelsD, lineCtx) {
        var imageData = lineCtx.createImageData(700, 700);
        for (var i = 0; i < pixelsD.length; i+= 4){
          var r = pixelsD[i];
          var g = pixelsD[i+1];
          var b = pixelsD[i+2];
          var a = pixelsD[i+3];
           
          if (matchOutlineColor(r, g, b, a) ){
              var y = Math.floor(i/2800);
              var x = (i/4) - y*700;
              lineCtx.rect(x, y, 1, 1);
              // a = 0.0;
           }
        }
        ctx.putImageData(imageData, 0, 0);
        lineCtx.clip();
        lineCtx.fillStyle="black";
        lineCtx.fillRect(0,0,700,700);
        console.log("ok");
        return lineCtx;
    }

    colorLayer.setAttribute('width', 700);// px
    colorLayer.setAttribute('height', 700);// px
    colorLayer.setAttribute('id', 'colorLayer');
    lineLayer.setAttribute('width', 700);// px
    lineLayer.setAttribute('height', 700);// px
    lineLayer.setAttribute('id', 'lineLayer');
    backUpLayer.setAttribute('width', 700);// px
    backUpLayer.setAttribute('height', 700);// px
    backUpLayer.setAttribute('id', 'backUpLayer');

    var colorContext = colorLayer.getContext("2d");
    var lineContext = lineLayer.getContext("2d");
    var backUpContext = backUpLayer.getContext("2d");
    var colorLayerData;
    var lineLayerData;
    var backUpContext;
    var pixels;
    var pixelsD;

    //imports template png to line layer
    var templateImage = new Image();
    templateImage.src = FlowRouter.getQueryParam("image");

    function combineCanvas (c1, ctx1, c2, ctx2) {
      var result = c1;
      ctx1.drawImage(c1, 0, 0);
      ctx1.drawImage(c2, 0, 0);
      return c1;
    }

    templateImage.onload = function() {
      console.log("loaded");
        colorContext.drawImage(templateImage, 0, 0);
        pixels = colorContext.getImageData(0, 0, 700, 700);
        pixelsD = pixels.data;
        lineContext = rmWhiteP(colorLayer, colorContext, pixelsD, lineContext);
        backUpContext.drawImage(lineLayer, 0, 0);
        if (debug) {
          colorContext.clearRect(0, 0, 700, 700);
        }
        
        try {
            lineLayerData = lineContext.getImageData(0, 0, 700, 700);
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
    var layer = "color";


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
    
    function redraw(){
      colorContext.clearRect(0, 0, 700, 700);
      colorContext.drawImage(templateImage, 0, 0);
      colorContext.lineJoin = "round";
      lineContext.clearRect(0, 0, 700, 700);
      lineContext.drawImage(backUpLayer, 0, 0);
      lineContext.lineJoin = "round";

      if(clickX.length > 100000) {

      }
      
      for(var i=0; i < clickX.length; i++) {  
        if (clickMode[i] === "brush") {
          if(debug){
            console.log("x = " + clickX[i] + ", y = " + clickY[i]);
          }
          if (clickCtx[i] === "color") {
            console.log("color");
            colorContext.beginPath();
            colorContext.globalAlpha = clickOpacity[i] / 100;
            if(clickDrag[i] && i){
              colorContext.moveTo(clickX[i-1], clickY[i-1]);
            }else{
              colorContext.moveTo(clickX[i]-1, clickY[i]);
            }
            colorContext.lineTo(clickX[i], clickY[i]);
            colorContext.closePath();
            colorContext.strokeStyle = clickColor[i];
            colorContext.lineWidth = clickSize[i];
            colorContext.stroke();

          } else if (clickCtx[i] === "line") {
            console.log("line");
            lineContext.beginPath();
        
            if(clickDrag[i] && i){
              lineContext.moveTo(clickX[i-1], clickY[i-1]);
            }else{
              lineContext.moveTo(clickX[i]-1, clickY[i]);
            }
            lineContext.lineTo(clickX[i], clickY[i]);
            lineContext.closePath();
            lineContext.strokeStyle = clickColor[i];
            lineContext.lineWidth = clickSize[i];
            lineContext.stroke();
            lineContext.globalAlpha = clickOpacity[i] / 100;
          }

        } else if (clickMode[i] === "fill") {
          colorContext.fillStyle = clickColor[i];
          if(debug){
            console.log("x = " + clickX[i] + ", y = " + clickY[i]);
          }
          var opacity = clickOpacity[i];
          // var rgb = hexToRgb(colorContext.fillStyle);
          // var fillColor = [rgb[0], rgb[1], rgb[2], opacity];
          if(debug) {
            console.log("fillcolor chosen is " + clickColor[i]);
          }
          colorContext.fillStyle = clickColor[i];
          colorContext.opacity = opacity;
          colorContext.fillFlood(clickX[i], clickY[i], 20);
        }   
        
      }
      colorContext.globalAlpha = 1;
      lineContext.globalAlpha = 1;
    }


    $('#lineLayer').mousedown(function(e){
      var mouseX = e.pageX - $('#lineLayer').offset().left;
      var mouseY = e.pageY - $('#lineLayer').offset().top;
      function dropperHelper(ctx) {
        var p;
        if (ctx === "color") {
          p = colorContext.getImageData(mouseX, mouseY, 1, 1).data;
        } else if (ctx === "line") {
          p = lineContext.getImageData(mouseX, mouseY, 1, 1).data;
        }
        var hex = ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        $('#colorPicker').colpickSetColor(hex,true); //using colpick      
      }
         
      if (mode === "brush") {          
        paint = true;
        addClick(mouseX, mouseY, false);
        redraw();
      } else if (mode === "dropper") {
        dropperHelper(layer);
      } else if (mode === "fill") {
        addClick(mouseX, mouseY, false);
        redraw();
      }
    });
    
    $('#lineLayer').mousemove(function(e){
        
      if(paint){
        var coordinateX = e.pageX - $('#lineLayer').offset().left;
        var coordinateY = e.pageY - $('#lineLayer').offset().top; 

        addClick(coordinateX, coordinateY, true);
        redraw();
        }
    });

    $('#lineLayer').mouseup(function(e){
      paint = false;
    });

    
    
    

    function addClick(x, y, dragging) {
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
        if(debug){
          console.log("Mode brush selected.")
        }
    });

    $('#button-fill').click(function() {
        mode = "fill";
        if(debug){
          console.log("Mode fill selected.");
        }
    });

    $('#button-line-layer').click(function() {
        console.log("linelayer");
        layer = "line";
    });

    $('#button-color-layer').click(function() {
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
            // magic();
        });

      //   var magic = function () {
      //   if (imageInfo) {
      //     var image = {
      //       data: imageInfo.data,
      //       width: imageInfo.width,
      //       height: imageInfo.height,
      //       bytes: 4
      //     };
      //     mask = MagicWand.floodfill(downPoint.x, downPoint.y, );
      //     mask = MagicWand.gaussBlurOnlyBorder(mask, blurRadius);
      //     masks.push(mask);
      //     cacheInds.push(MagicWand.getBorderIndices(mask));
      //     drawBorder(true);
      //   }
      // };

      

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

    var saveButton = document.getElementById('button-save');
    saveButton.addEventListener('click', function(e) {
      colorContext.drawImage(lineLayer, 0, 0);
      var dataURL = colorLayer.toDataURL('image/png');
      saveButton.href = dataURL;
      saveButton.download = 'image.png';
    });
});
