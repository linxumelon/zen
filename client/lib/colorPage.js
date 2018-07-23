import {$,jQuery} from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.colorPage.rendered = function() {

  var debug = false;

  $(function() {
      var colorLayer    = document.getElementById('colorLayer');
      var lineLayer    = document.getElementById('lineLayer');
      var backUpLayer = document.createElement('canvas');
      var selectedLayer = document.getElementById('selectedLayer');

      var matchOutlineColor = function(r, g, b, a){
          return (r + g + b < 600 && a > 0);
      };
      //turns non-black pixels to transparent
      var rmWhiteP = function(canvas, ctx, pixelsD, lineCtx, backUpD) {
          var imageData = lineCtx.createImageData(700, 700);
          for (var i = 0; i < pixelsD.length; i+= 4){
            var r = pixelsD[i];
            var g = pixelsD[i+1];
            var b = pixelsD[i+2];
            var a = pixelsD[i+3];
            
            if (matchOutlineColor(r, g, b, a) ){
                var y = Math.floor(i/2800);
                var x = (i/4) - y*700;
                lineCtx.strokeStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
                lineCtx.rect(x, y, 1, 1);
                backUpCtx.strokeStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
                backUpCtx.rect(x, y, 1, 1);
              
                // a = 0.0;
            }
            
          }
          ctx.putImageData(imageData, 0, 0);
          lineCtx.clip();
          console.log("ok");

          return lineCtx;
      }
      function setCanvasAttr(c, width, height ,id) {
        c.setAttribute('width', width);// px
        c.setAttribute('height', height);// px
        c.setAttribute('id', id);
      }
      setCanvasAttr(colorLayer, 700, 700, 'colorLayer');
      setCanvasAttr(lineLayer, 700, 700, 'lineLayer');
      setCanvasAttr(backUpLayer, 700, 700, 'backUpLayer');
      setCanvasAttr(selectedLayer, 700, 700, 'selectedLayer');
     

      var colorContext = colorLayer.getContext("2d");
      var lineContext = lineLayer.getContext("2d");
      var backUpContext = backUpLayer.getContext("2d");
      var selectedContext = selectedLayer.getContext("2d");
      var colorLayerData;
      var lineLayerData;
      var backUpData = backUpContext.getImageData(0, 0, 700, 700);
      var selectedData = selectedContext.getImageData(0, 0, 700, 700);
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
          backUpContext.strokeStyle = 'rgba(0, 0, 0, 0)';
          backUpContext.rect(0, 0, 700, 700);
          lineContext = rmWhiteP(colorLayer, colorContext, pixelsD, lineContext, backUpCtx);
         
          if (debug) {
            console.log("selected Layer is "  + selectedLayer);
            colorContext.clearRect(0, 0, 700, 700);
          }
          if(debug){
            console.log("selected context is" + selectedContext)
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


      $('#selectedLayer').mousedown(function(e){
        var mouseX = e.pageX - $('#selectedLayer').offset().left;
        var mouseY = e.pageY - $('#selectedLayer').offset().top;
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

        if (mode === "select") {
          paint = false;
          if(debug) {
            console.log("click received.")
          } 
          if(debug){
            console.log(selectedContext);
          }  
          select(mouseX, mouseY, backUpData.data,
            selectedContext, colorLayer);
  
          colorContext.drawImage(colorLayer, 0, 0);
          selectedContext.drawImage(selectedLayer, 0, 0);
          selectedContext.clip();
          
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
      
      $('#selectedLayer').mousemove(function(e){
          
        if(paint){
          var coordinateX = e.pageX - $('#selectedLayer').offset().left;
          var coordinateY = e.pageY - $('#selectedLayer').offset().top; 

          addClick(coordinateX, coordinateY, true);
          redraw();
          }
      });

      $('#selectedLayer').mouseup(function(e){
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

      function getPixelPos(x, y, canvas) {
        return Math.floor((y*canvas.width + x) * 4);
    }
    function getPixelColor(x, y, imageData, canvas) {
      var pixelPos = getPixelPos(x, y, canvas);
      if(debug) {
        // console.log("pixelPos = " + pixelPos);
        // console.log("imageData[pixelPos]" + imageData[pixelPos]);
      } 
      return [imageData[pixelPos], imageData[pixelPos+1], imageData[pixelPos+2], imageData[pixelPos+3]];
    }
      
    function matchOutline(pixelPos, imageData) {
      if(debug){
        // console.log("imageData[pixelPos+3] = " + imageData[pixelPos+3]);
        // console.log("matchOutline: " + (imageData[pixelPos+3] > 0));
      }
      return (imageData[pixelPos+3] > 0);
    }

    function selectPixel (pixelPos, imageData, selectedCtx) {
      if(debug) {
        // console.log("fillPixel has been called.");
      }
      var y = Math.floor(pixelPos/2800);
      var x = (pixelPos/4) - y*700;
      var color;
      if((x%3) === 0) {
        color = 'rgba(0, 0, 0, 0.3)';
      } else {
        color = 'rgba(255, 255, 255, 0.3)';
      }
      selectedCtx.strokeStyle = color;
      selectedCtx.rect(x, y, 1, 1);
      imageData[pixelPos] = 200;
      imageData[pixelPos+1] = 200;
      imageData[pixelPos+2] = 200;
      imageData[pixelPos+3] = 1;
    }
      
    function select(startX, startY, imageData, selectedCtx, canvas) {
      if(debug) {
        console.log("imageData[1]=" + imageData[1]);
        console.log(imageData);
      }
      pixelStack = new Array();
      pixelStack.push([Math.floor(startX), Math.floor(startY)]);
      if(debug) {
      }
    
      while (pixelStack.length) {
        var newPos, x, y, pixelPos, reachLeft, reachRight;
        newPos = pixelStack.pop();
        
        x = newPos[0];
        y = newPos[1];
        pixelPos = getPixelPos(x, y, canvas);
        if(debug) {
          // console.log("x = " + x + ", y = " + y);
        }
        while (y >= 1 && 
            !matchOutline(pixelPos, imageData)) {
          pixelPos -= canvas.width * 4;
          y--;
          if(debug) {
            // console.log("y = " + y);
          }
        }
        reachLeft = false;
        reachRight = false;
        if(debug) {
        }
        if(debug) {
          // console.log("now y = " + y);
        }
        y++;
        pixelPos += canvas.width * 4;
        if(debug) {
          // console.log("y <= canvas.height - 2: " +(y <= canvas.height - 2) );
        }
        var i = 0;
        while((y <= canvas.height - 2) && 
            !matchOutline(pixelPos, imageData)) {
              if(debug) {
                // console.log("second whileloop, y = " + y);
              }   
          selectPixel(pixelPos, imageData, selectedCtx);
          if (x > 0) {
            if (!matchOutline(pixelPos - 4, imageData)) {
              if (!reachLeft) {
                pixelStack.push([x-1, y]);
                reachLeft = true;
              }
            } else {
              reachLeft = false;
            }
          }
          if (x < canvas.width - 1) {
            if (!matchOutline(pixelPos + 4, imageData)) {
              if (!reachRight) {
                pixelStack.push([x+1, y]);
                reachRight = true;
              }
            } else {
              reachRight = false;
            }
          }
          y++;
          pixelPos += canvas.width * 4;
        }
        if(debug) {
          console.log("i = " + i);
        }
        i++;
      }
      if(debug) {
        console.log("selection ended.");
      }

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
          mode = "select";
          if(debug) {
            console.log("mode Select selected.");
          }
          // $('selectedLayer').on('click', function (e) {
          //   if(debug) {
          //     console.log("click received.")
          //   }
          //   var p = $(e.target).offset();
          //   var x = Math.round((e.clientX || e.pageX) - p.left);
          //   var y = Math.round((e.clientY || e.pageY) - p.top);  

              
          //     // magic();
          // });

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

        

        // var checkOutLine = function() {
            
        // }
        
        // var colorPixel =  function (pixelPos, r, g, b, a) {
          
        // }
        // var drawBorder = function () {
        //   if (masks.length) {

        //     var x, y, k, i, j, m,
        //         w = imageInfo.width,
        //         h = imageInfo.height,
        //         ctx = imageInfo.context,
        //         imgData = ctx.createImageData(w, h),
        //         res = imgData.data;
            
        //     ctx.clearRect(0, 0, w, h);
            
        //     for (m = 0; m < masks.length; m++) {
              
        //       cacheInd = cacheInds[m];
              
        //       for (j = 0; j < cacheInd.length; j++) {
        //         i = cacheInd[j];
        //         x = i % w; // calc x by index
        //         y = (i - x) / w; // calc y by index
        //         k = (y * w + x) * 4; 
        //         if ((x + y + hatchOffset) % (hatchLength * 2) < hatchLength) { 
        //           // detect hatch color 
        //           res[k + 3] = 255; // black, change only alpha
        //         } else {
        //           res[k] = 255; // white
        //           res[k + 1] = 255;
        //           res[k + 2] = 255;
        //           res[k + 3] = 255;
        //         }
        //       }
        //     }
        //     ctx.putImageData(imgData, 0, 0);
        //   }
        // };

        // setInterval(function () {
        //   hatchOffset = (hatchOffset + 1) % (hatchLength * 2);
        //   drawBorder();
        // }, 100);
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
}
