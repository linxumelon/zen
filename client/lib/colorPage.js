import {$,jQuery} from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

$(function() {
    var colorLayer    = document.getElementById('colorLayer');
    var lineLayer    = document.getElementById('lineLayer');
    colorLayer.setAttribute('width', 700);// px
    colorLayer.setAttribute('height', 700);// px
    colorLayer.setAttribute('id', 'colorLayer');
    lineLayer.setAttribute('width', 700);// px
    lineLayer.setAttribute('height', 700);// px
    lineLayer.setAttribute('id', 'lineLayer');

    var colorContext = colorLayer.getContext("2d");
    var lineContext = lineLayer.getContext("2d");
    var colorLayerData;
    var lineLayerData;

    //imports template png to line layer
    var templateImage = new Image();
    templateImage.src = FlowRouter.getQueryParam("image");

    templateImage.onload = function() {
        colorContext.drawImage(templateImage, 0, 0);
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
    var lineWidth = 10;
    var color = "#df4b26";
    var paint = false;


    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var clickTool = new Array();
    var clickColor = new Array();
    var clickSize = new Array();

    

    $('#lineLayer').mousedown(function(e){
      var mouseX = e.pageX - $('#lineLayer').offset().left;
      var mouseY = e.pageY - $('#lineLayer').offset().top;
         
      if (mode === "brush") {          
        paint = true;
        addClick(e.pageX - $('#lineLayer').offset().left, e.pageY - $('#lineLayer').offset().top);
        redraw();
      } else if (mode === "dropper") {
        var p = colorContext.getImageData(mouseX, mouseY, 1, 1).data;
        var hex = ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        $('#colorPicker').colpickSetColor(hex,true); //using colpick
      } else if (mode === "fill") {

      }
    });
    
    $('#lineLayer').mousemove(function(e){
      if(paint){
        addClick(e.pageX - $('#lineLayer').offset().left, e.pageY - $('#lineLayer').offset().top, true);
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
      clickSize.push(lineWidth);
    }

    function redraw(){
      //colorContext.clearRect(0, 0, 700, 700);
      colorContext.lineJoin = "round";
                
      for(var i=0; i < clickX.length; i++) {        
        colorContext.beginPath();
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
      }
      
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
        
    });

    $('button-color-layer').click(function() {
        
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
