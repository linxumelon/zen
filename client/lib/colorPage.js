import {$,jQuery} from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.colorPage.rendered = function() {

  var debug = false;

  $(function() {
      var colorLayer    = document.getElementById('colorLayer');
      var lineLayer    = document.getElementById('lineLayer');
      var backUpLayer = document.createElement('canvas');
      var selectedLayer = document.getElementById('selectedLayer');
      var selectBUC = document.createElement('canvas');
      var emptyC = document.createElement('canvas');
      var effectLayer = document.getElementById('effectLayer');

      var matchOutlineColor = function(r, g, b, a){
          return (r <200 || g < 200 || b < 200 && a > 200);
      };

      //Create lineLayer
      function rmWhiteP(canvas, ctx, pixelsD, lineCtx, selectBUCtx) {
          var imageData = lineCtx.createImageData(700, 700);
          for (var i = 0; i < pixelsD.length; i+= 4){
            var r = pixelsD[i];
            var g = pixelsD[i+1];
            var b = pixelsD[i+2];
            var a = pixelsD[i+3];

            if(debug) {
              // console.log("r = " + r + ", g = " + g + ", b = " + b + ", a = " + a);
            }
            
            if (matchOutlineColor(r, g, b, a) ){
              if(debug) {
                // console.log("matches outline");
              }
                var y = Math.floor(i/2800);
                var x = (i/4) - y*700;
                lineCtx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                // lineCtx.beginPath();
                lineCtx.rect(x, y, 1, 1);
                // lineCtx.stroke();
                // lineCtx.closePath();
                selectBUCtx.fillStyle = 'rgba(255, 255, 255, 1)';
                selectBUCtx.fillRect(x, y, 1, 1);
                if(debug) {
                  // console.log("r = " + r);
                }
            }
          }
          ctx.putImageData(imageData, 0, 0);
          lineCtx.clip();
          lineCtx.fill();
          console.log("ok");
          return lineCtx;
      }
      //Set canvas attribute
      function setCanvasAttr(c, width, height ,id) {
        c.setAttribute('width', width);// px
        c.setAttribute('height', height);// px
        c.setAttribute('id', id);
      }
      setCanvasAttr(colorLayer, 700, 700, 'colorLayer');
      setCanvasAttr(lineLayer, 700, 700, 'lineLayer');
      setCanvasAttr(backUpLayer, 700, 700, 'backUpLayer');
      setCanvasAttr(selectedLayer, 700, 700, 'selectedLayer');
      setCanvasAttr(selectBUC, 700, 700, 'selectBUC');
      setCanvasAttr(emptyC, 700, 700, 'emptyC');
      setCanvasAttr(effectLayer, 700, 700, 'effectLayer');
     
      //Initialize canvas context and image data
      var colorContext = colorLayer.getContext("2d");
      var lineContext = lineLayer.getContext("2d");
      var backUpContext = backUpLayer.getContext("2d");
      var selectedContext = selectedLayer.getContext("2d");
      var selectBUCtx = selectBUC.getContext("2d");
      var emptyCtx = emptyC.getContext("2d");
      var effectContext = effectLayer.getContext('2d');
      // emptyCtx.fillStyle = "red";
      // emptyCtx.fillRect(0, 0, 700, 700);
    
      var colorLayerData;
      var lineLayerData;
      var backUpContext;
      var pixels;
      var pixelsD;
      var selectBUD;
      

      //Imports template png
      var templateImage = new Image();
      templateImage.src = FlowRouter.getQueryParam("image");
      // emptyCtx.fillStyle = 'rgba(255, 255, 255, 0)';
      // emptyCtx.fillRect(0, 0, 700, 700);

      templateImage.onload = function() {
        console.log("loaded");
          colorContext.drawImage(templateImage, 0, 0);
          // colorContext.fillStyle = "white";
          // colorContext.fillRect(0, 0, 700, 700)
          pixels = colorContext.getImageData(0, 0, 700, 700);
          pixelsD = pixels.data;
          lineContext = rmWhiteP(colorLayer, colorContext, pixelsD, lineContext, selectBUCtx);
          lineContext.drawImage(lineLayer, 0, 0);
          backUpContext.drawImage(lineLayer, 0, 0);
          selectedContext.drawImage(emptyC, 0, 0);
          selectBUD = selectBUCtx.getImageData(0, 0, 700, 700); 

          if (debug) {
            colorContext.clearRect(0, 0, 700, 700);
          }
          
          try {
              lineLayerData = lineContext.getImageData(0, 0, 700, 700);
              colorLayerData = colorContext.getImageData(0, 0, 700, 700);
          } catch (ex) {

          }
          redraw();
      };

      //Initialize paint feature var
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
      var clickSelect = new Array();//context of selected area

      var redoX = new Array();
      var redoY = new Array();
      var redoDrag = new Array();
      var redoMode = new Array();
      var redoColor = new Array();
      var redoSize = new Array();
      var redoOpacity = new Array();
      var redoCtx = new Array();
      var redoSelect = new Array();

      var inSelect;

      
      function redraw(){

        function canvasResetHelper(ctx, x, y, width, height, image) {
          ctx.clearRect(0, 0, 700, 700);
          ctx.drawImage(image, 0, 0);
          ctx.lineJoin = "round";
        }
        
        canvasResetHelper(colorContext, 0, 0, 700, 700, templateImage);
        canvasResetHelper(lineContext, 0, 0, 700, 700, backUpLayer);
        selectedContext.width = selectedContext.width;
        selectedContext.lineJoin = "round";

        if(clickX.length > 100000) {
        }

        function brushHelper (ctx, i) {
          ctx.globalAlpha = clickOpacity[i] / 100;
          ctx.beginPath();
          if(clickDrag[i] && i){
            ctx.moveTo(clickX[i-1], clickY[i-1]);
          }else{
            ctx.moveTo(clickX[i]-1, clickY[i]);
          }
          ctx.lineTo(clickX[i], clickY[i]);
          ctx.closePath();
          ctx.strokeStyle = clickColor[i];
          ctx.lineWidth = clickSize[i];
          ctx.stroke();
         
        }

        function checkSC() {
          if(inSelect) {
            inSelect = false;
            colorContext.drawImage(selectedLayer, 0, 0);
            // selectedContext.clearRect(0, 0, 700, 700);
          }
        }

        for (var i=0; i < clickX.length; i++) {  
          if (clickMode[i] === "brush") {
            checkSC();
            if(debug){
              console.log("x = " + clickX[i] + ", y = " + clickY[i]);
            }
            if (clickCtx[i] === "color") {
              console.log("color");
              brushHelper(colorContext, i);
            } else if (clickCtx[i] === "line") {
              console.log("line");
              brushHelper(lineContext, i);
            } else if (clickCtx[i] === "multiselect") {
              console.log("multiselect");
              brushHelper(selectedContext, i);
            }
          } else if (clickMode[i] === "fill") {
            checkSC();
            colorContext.fillStyle = clickColor[i];
            if(debug){
              console.log("x = " + clickX[i] + ", y = " + clickY[i]);
            }
            var opacity = clickOpacity[i];
            if(debug) {
              console.log("fillcolor chosen is " + clickColor[i]);
            }
            colorContext.fillStyle = clickColor[i];
            colorContext.opacity = opacity;
            if(debug) {
              console.log("opacity = " + opacity);
            }
            colorContext.fillFlood(clickX[i], clickY[i], 20);
          } else if (clickMode[i] === "select") {
            if(!inSelect) {
              inSelect = true;
            }
            selectedContext = multiSelect(clickX[i], clickY[i], selectBUD.data,
              selectedContext, colorLayer);
          }   
        }
        colorContext.globalAlpha = 1;
        lineContext.globalAlpha = 1;
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


      function setPixel (pixelPos, imageData, selectedCtx) {
        if(debug) {
          // console.log("fillPixel has been called.");
        }
        var y = Math.floor(pixelPos/2800);
        var x = (pixelPos/4) - y*700;      
          var color;
          if((x%4 === 0)&&(y%4 === 0)) {
            color = 'rgba(0, 0, 0, 0.4)';
          } else {
            color = 'rgba(255, 255, 255, 0.2)';
          }
          // selectedCtx.globalAlpha = 0.2;
          // selectedCtx.strokeStyle = 'rgb(200, 200, 200)';
          // selectedCtx.fillRect(x, y, 1, 1);
          selectedCtx.strokeStyle = color;
          selectedCtx.rect(x, y, 1, 1);
          effectContext.fillStyle = color;
          effectContext.fillRect(x, y, 1, 1);
        if(debug) {
          console.log("pixel set on selectedCtx");
        }
        
        imageData[pixelPos] = 200;
        imageData[pixelPos+1] = 200;
        imageData[pixelPos+2] = 200;
        imageData[pixelPos+3] = 1;
      }
        
      function multiSelect(startX, startY, imageData, selectedCtx, canvas) {
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
            setPixel(pixelPos, imageData, selectedCtx);
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
        // selectedContext.fillStyle = 'rgba(200, 200, 200, 0.4)';
        // selectedContext.fill();
        // selectedContext.clip();
          // selectedContext.fillStyle = 'rgba(255, 255, 255, 0)';
          // selectedContext.fill();
        selectedContext.fillStyle = 'rgba(200, 200, 200, 0)';
        selectedContext.fill();
        return selectedContext;
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
          } else if (ctx === "multiselect") {
            p = selectedContext.getImageData(mouseX, mouseY, 1, 1).data;
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
          if (layer === "line") {
            alert("Please switch to brush mode when coloring on line art")
          } else {
            addClick(mouseX, mouseY, false);
            redraw();
          }
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

      $('#lineLayer').click(function(e) {
        var mouseX = e.pageX - $('#lineLayer').offset().left;
        var mouseY = e.pageY - $('#lineLayer').offset().top; 
        if (mode === "select") {
          selectedContext = multiSelect(mouseX, mouseY, selectBUD.data,
            selectedContext, colorLayer);
          addClick(mouseX, mouseY, false);
          // colorContext.drawImage(colorLayer, 0, 0);
          // selectedContext.clip();
        }
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
        // clickSelect.push(selectedContext);
        
        redoX = [];
        redoY = [];
        redoMode = [];
        redoDrag = [];
        redoColor = [];
        redoSize = [];
        redoOpacity = [];
        redoCtx = [];
        // redoSelect = [];
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
          $('#currentMode').html(mode);
          if(debug){
            console.log("Mode brush selected.")
          }
          if (layer === "multiselect") {
            selectedContext.clip();
            selectedContext.clearRect(0, 0, 700, 700);
          }
      });

      $('#button-fill').click(function() {
          mode = "fill";
          $('#currentMode').html(mode);
          if(debug){
            console.log("Mode fill selected.");
          }
      });

      $('#button-line-layer').click(function() {
          console.log("linelayer");
          layer = "line";
      });

      $('#button-color-layer').click(function() {
          console.log("colorLayer");
          layer = "color";
      });

      $('#button-eyedrop').click(function() {    
        mode = "dropper";
        $('#currentMode').html(mode);
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
          redoSelect.push(clickSelect.pop());
          
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
          clickSelect.push(redoSelect.pop());
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

      $('#button-select').click(function() {
          mode = "select";
          $('#currentMode').html(mode);
          paint = false;
          layer = "multiselect";
        if(debug) {
          console.log(mode);
        }
      });

      $('#button-deselect').click(function() {
          mode = "brush";
          layer = "color";
          effectLayer.width = effectLayer.width;
      });

      $('#sizeSlide').slider({
        min: 1,
        max: 100,
        value: 50,
        change: function(event, ui) {
          lineWidth = ui.value;
          $('#sizeIndicator').val(ui.value);
        }
      });
      
      $('#opacitySlide').slider({
        min: 1,
        max: 100,
        value: 100,
        change: function(event, ui) {
          opacity = ui.value;
          $('#opacityIndicator').val(ui.value);
        }
      });

      $('#sizeIndicator').val(lineWidth);

      $('#opacityIndicator').val(opacity);

      $('#sizeIndicator').change(function() {
        lineWidth = this.value;
        $('#sizeSlide').slider({value: this.value});
      })

      $('#opacityIndicator').change(function() {
        opacity = this.value;
        $('#opacitySlide').slider({value: this.value});
      })

      $('#currentMode').html(mode);

      var saveButton = document.getElementById('button-save');
      saveButton.addEventListener('click', function(e) {
        colorContext.drawImage(lineLayer, 0, 0);
        var dataURL = colorLayer.toDataURL('image/png');
        saveButton.href = dataURL;
        saveButton.download = 'image.png';
      });
  });
}
