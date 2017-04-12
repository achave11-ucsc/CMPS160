function createSOR(){
	createS = true;
}

function lClick(ev){
	createS = true;
	var rect = ev.target.getBoundingClientRect() ;
	var chk = check(ev);
	if(!createS){
		alert("Press button 'Create SOR'");
	}

	else if(!endRightClick && createS){
		var x = ev.clientX; // x coordinate of a mouse pointer
		var y = ev.clientY; // y coordinate of a mouse pointer
  		//var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

		var coords = new xyzValues(x, y, 0);
		originalCoords.push(coords);

		points.push(x, y);

		if (points.length > 2 ){
			drawPoints();
		}
	}

	else if(typeof chk == "number") {
        transformationDone = false;

        listOfObjects[chk].transformObject(null, null);
        renderScene(true);
    }
    if(chk == true && transformationDone == true){

        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

        renderScene(false);
    }
}

function rClick(ev){
	ev.preventDefault();

	if(!endRightClick){
		var x = ev.clientX; // x coordinate of a mouse pointer
		var y = ev.clientY; // y coordinate of a mouse pointer
		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

		var coords = new xyzValues(x, y, 0);
		originalCoords.push(coords);

		endRightClick = true;
		points.push(x, y);
		if (points.length > 2 ){
			drawPoints();
		}
		SORGenerator();
		calcVertices();
		objectCounter -= 1;
		var drawnObject = new SORObject(vertices, indexes, [0.0, 1.0, 0.0, (objectCounter/255)]);
		listOfObjects.push(drawnObject);

		masterYellow = true;
		var YCube = new yellowCube(gl);
        lightSources.push(YCube);
        renderScene(false);
	}

	else{
		//Do something! ß
	}
}

function mouseMove(ev){

	if (points.length > 2 && !endRightClick){
		drawPoints();
	}

	if(!endRightClick && points.length > 1){
		var ptsLen = points.length;
		var tempX = points[ptsLen-2];
		var tempY = points[ptsLen-1];

		var x = ev.clientX; // x coordinate of a mouse pointer
		var y = ev.clientY; // y coordinate of a mouse pointer
		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

		var rubber = [tempX, tempY, x, y];
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER);
		var n = bindBuffer(gl, rubber, 2);
    		gl.drawArrays(gl.LINES, 0, n);
    	if (points.length > 2){
    		drawPoints();
    	}
	}

	if((clickedBG == true) && endRightClick && !orthoproj && mouseIsDown){
		var x = ev.clientX ;
		var y = ev.clientY ;

		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

        if((oldX || oldY) == 0){
            oldX = x;
            oldY = y;
        }

        var vals = getDeltaValues(oldX, oldY, x, y);

        PangX += vals[0];

		PangY += vals[1];

		oldX = x;
		oldY = y;
		var modelMatrix = new Matrix4(); // Model matrix
		var viewMatrix = new Matrix4();  // View matrix
		var projMatrix = new Matrix4();  // Projection matrix
		//var mvpMatrix = new Matrix4();   // Model view projection matrix

		// Calculate the model, view and projection matrices
		modelMatrix.setTranslate(0, 0, inNOut);

		viewMatrix.setLookAt(PangX, PangY, 4.5, 0, 0, -50, 0, 1, 3);
		projMatrix.setPerspective(defFOV, canvas.width/canvas.height, 1, 100);
		// Calculate the model view projection matrix
		mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
		// Pass the model view projection matrix to u_MvpMatrix
		gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

        renderScene(false);
	}

	if ((clickedBG == true) && endRightClick && orthoproj && mouseIsDown){
	    var x = ev.clientX;
		var y = ev.clientY;

		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
        if((ortOldX || ortOldY) == 0){
            ortOldX = x;
            ortOldY = y;
        }
        //var vals = getDeltaValues(ortOldX, ortOldY, x, y);
		var dx = x - ortOldX;
		var dy = y - ortOldY;
		if(Math.abs(dy) < Math.abs(dx)){
			if(x - ortOldX < 0){
				ortPangX += -Math.abs(dx);
			}
			else{
				ortPangX += Math.abs(dx);
			}
		}
		else{
			if(y - ortOldY < 0){
				ortPangY += -Math.abs(dy);
			}
			else{
				ortPangY += Math.abs(dy);
			}
		}
		ortOldX = x;
		ortOldY = y;
		mvpMatrix.setOrtho(-1, 1, -1, 1, -1, 1);
		mvpMatrix.setTranslate(-ortPangX, -ortPangY, -1+ortInNOut);

		gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);


		orthoproj = true;

        renderScene();
	}

	if(transformObjectXYZ == true && transformationDone == false && mouseIsDown && orthoproj){
        var chk = check(ev);
	    var x = ev.clientX;
        var y = ev.clientY;

        var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

        listOfObjects[chk].transformObject(x, y) ;
        renderScene(true);
	}

	if(transformObjectXYZ == true && transformationDone == false && mouseIsDown && !orthoproj){
        var chk = check(ev);
        var x = ev.clientX;
        var y = ev.clientY;

        var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
        listOfObjects[chk].transformObject(x, y) ;
        renderScene(true);
    }

    if(rightClickIsDown == true && transformationDone == false && !orthoproj){
        var x = ev.clientX; // x coordinate of a mouse pointer
        var y = ev.clientY; // y coordinate of a mouse pointer
        var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

        listOfObjects[prevObj].transformObject(x, y);
        renderScene(true);
    }
}

function Zoom(ev){

	ev.preventDefault();
	if(endRightClick && !orthoproj && transformationDone == true){
		var modelMatrix = new Matrix4(); // Model matrix
		var viewMatrix = new Matrix4();  // View matrix
		var projMatrix = new Matrix4();  // Projection matrix

		defFOV = defFOV + ev.deltaY/3;
		if(defFOV < 3 ){
			defFOV = 2;
		}
		else if(defFOV > 179){
			defFOV = 180;
		}

		// Calculate the model, view and projection matrices
		modelMatrix.setTranslate(0, 0, inNOut);
		viewMatrix.setLookAt(PangX, PangY, 4.5, 0, 0, -50, 0, 1, 3);
		projMatrix.setPerspective(defFOV, canvas.width/canvas.height, 1, 100);

		// Calculate the model view projection matrix
		mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

        renderScene(false);
	}

	else if(endRightClick && !orthoproj && inNOutBool ){
		var modelMatrix = new Matrix4(); // Model matrix
		var viewMatrix = new Matrix4();  // View matrix
		var projMatrix = new Matrix4();  // Projection matrix
		//var mvpMatrix = new Matrix4();   // Model view projection matrix
		inNOut +=  ev.deltaY;
		// Calculate the model, view and projection matrices
		modelMatrix.setTranslate(0, 0, inNOut);
		viewMatrix.setLookAt(PangX, PangX, 4.5, 0, 0, -50, 0, 1, 3);
		projMatrix.setPerspective(defFOV, canvas.width/canvas.height, 1, 100);
		// Calculate the model view projection matrix
		mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
		// Pass the model view projection matrix to u_MvpMatrix
		gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

	 	// for(var i = 0; i < listOfObjects.length; i ++){
	 	// 	listOfObjects[i].renderColor(false);
		// }
	}

	else if(endRightClick && orthoproj && ortInNOutBool ){
		ortInNOut += ev.deltaY/30;
		mvpMatrix.setOrtho(-1, 1, -1, 1, -1, 1);
		mvpMatrix.setTranslate(-ortPangX, -ortPangY, -1 + ortInNOut);

		gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

		// for(var i = 0; i < listOfObjects.length; i ++){
	 	// 	listOfObjects[i].renderColor(false);
		// }
	}

    if(transformObjectXYZ == false && transformationDone == false && !orthoproj) {
        var chk = check(ev);
        var xyz = listOfObjects[chk].scaling;
        var factor = listOfObjects[chk].scaleFactor;
        console.log(xyz);
        //console.log(factor);
        factor += ev.deltaY / 100;

        if (factor < 0.5) {
            factor = 0.5;
        }

        if (factor > 2.0) {
            factor = 2;
        }
        else {


            listOfObjects[chk].scaleFactor = factor;
            listOfObjects[chk].scaling.x = factor;
            listOfObjects[chk].scaling.y = factor;
            listOfObjects[chk].scaling.z = factor;
            renderScene(true);
        }
    }

    if(transformObjectXYZ == false && transformationDone == false && orthoproj == true) {
        var chk = check(ev);

        var factor = listOfObjects[chk].oScaleFactor;
        console.log(factor);
        factor += ev.deltaY / 100;

        if (factor < 0.5) {
            factor = 0.5;
        }

        if (factor > 2.0) {
            factor = 2;
        }
        else {
            listOfObjects[chk].oScaleFactor = factor;
            renderScene(true);
        }
    }

}

function check(ev){

	if(objectCounter < 255){
		var pixels = new Uint8Array(4);
		gl.readPixels(ev.clientX - 13, canvas.height - ev.clientY+ 15, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		var white = 0;
		for(var i = 0; i < pixels.length; i ++){
			if(pixels[i] == 255){
				white ++;
			}
		}
		if(white == 4){
			clickedBG == true;
			return true;
		}

		for(var i = 0; i < listOfObjects.length; i ++){
			var objNo = listOfObjects[i].objectId;
			if(pixels[3] == objNo ){
				return i;
			}
		}
	}
	else{
		return -1;
	}
}

function mouseDown(ev){
    mouseIsDown = true;
	var pixels = new Uint8Array(4);
	gl.readPixels(ev.clientX - 13, canvas.height - ev.clientY+ 15, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

	if(ev.which == 2 && clickedBG && !orthoproj){
		if(!inNOutBool){
			inNOutBool = true;
		}
		else{
			inNOutBool = false;
		}
	}

	else if (ev.which ==2 && clickedBG && orthoproj){
		if(!ortInNOutBool){
			ortInNOutBool = true;
		}
		else{
		ortInNOutBool = false;
		}
	}

	else if(ev.which == 1 && clickedBG == false){
		var chk = check(ev);

        if(typeof chk == "number") {
            prevObj = chk;
            transformObjectXYZ = true;
            console.log("Transform: ", chk);
            var x = ev.clientX; // x coordinate of a mouse pointer
            var y = ev.clientY; // y coordinate of a mouse pointer
            var rect = ev.target.getBoundingClientRect(); //Normalize canvas

            x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
            y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
            listOfObjects[chk].bool = true;
            if (transformationDone == false && orthoproj && ctr1 > 0) {
                ctr1 ++;
                listOfObjects[chk].translation.x = x;
                listOfObjects[chk].translation.y = y;
            }
            else if(transformationDone == false && !orthoproj && ctr2 > 0){
                ctr2 ++;
                listOfObjects[chk].projTranslation.x = x;
                listOfObjects[chk].projTranslation.y = y;
            }
        }
		else{
		    transformObjectXYZ = false;
        }

        if(chk == true){
            transformationDone = true;
			clickedBG = true;
		}
	}

	else if(ev.which == 3 && transformationDone == false){
	    rightClickIsDown = true;
    }
}

function mouseUp(){
    mouseIsDown = false;
    clickedBG = false;
    camlClick = false;
    transformObjectXYZ = false;
    rightClickIsDown = false;
    ortOldX = 0;
    ortOldY = 0;
    oldX = 0;
    oldY = 0;
}
