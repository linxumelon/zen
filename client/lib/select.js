    function getPixelPos(x, y, canvas) {
      return Math.floor((y*canvas.width + x) * 4);
    }
    function getPixelColor(x, y, imageData, canvas) {
      var pixelPos = getPixelPos(x, y, canvas);
      if(debug) {
        console.log("pixelPos = " + pixelPos);
        console.log("imageData[pixelPos]" + imageData[pixelPos]);
      }
    
      return [imageData[pixelPos], imageData[pixelPos+1], imageData[pixelPos+2], imageData[pixelPos+3]];
	}
	
    function matchOutlineColor(pixelPos, imageData) {
      if(debug){
      }
	  return (imageData[pixelPos+3] > 0);
	}

    function selectPixel (pixelPos, imageData, selectedData) {
      if(debug) {
        console.log("fillPixel has been called.");
	  }
	  selectedData[pixelPos] = 200;
	  selectedData[pixelPos+1] = 200;
	  selectedData[pixelPos+2] = 200;
	  selectedData[pixelPos+3] = 1;
	}
	
    function selectArea(startX, startY, imageData, selectedData, canvas) {
      if(debug) {
      }
	  var startColor = getPixelColor(startX, startY, imageData, canvas); 

      pixelStack = new Array();
      pixelStack.push([Math.floor(startX), Math.floor(startY) ]);
      if(debug) {
      }

      while (pixelStack.length) {
        var newPos, x, y, pixelPos, reachLeft, reachRight;
        newPos = pixelStack.pop();
        
        x = newPos[0];
        y = newPos[1];
        pixelPos = getPixelPos(x, y, canvas);
        if(debug) {
          console.log("x = " + x + ", y = " + y);
        }
        while (y >= 1 && 
            matchOutlineColor(pixelPos, imageData)) {
          pixelPos -= canvas.width * 4;
          y--;
          if(debug) {
            console.log("y = " + y);
          }
        }
        reachLeft = false;
        reachRight = false;
        if(debug) {
          console.log(matchStartColor(pixelPos, imageData));
        }
        if(debug) {
          console.log("now y = " + y);
        }
        y++;
        pixelPos += canvas.width * 4;
        if(debug) {
        }
        while((y <= canvas.height - 2) && 
            matchOutlineColor(pixelPos, imageData)) {
              if(debug) {
                console.log("second whileloop, y = " + y);
              }   
          selectPixel(pixelPos, imageData, selectedData);
          if (x > 0) {
            if (matchOutlineColor(pixelPos - 4, imageData)) {
              if (!reachLeft) {
                pixelStack.push([x-1, y]);
                reachLeft = true;
              }
            } else {
              reachLeft = false;
            }
          }
          if (x < canvas.width - 1) {
            if (matchOutlineColor(pixelPos + 4, imageData)) {
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
      }
      return selectedData;
    }