function createSOR(){
	createS = true;
}

function lClick(ev){
	createS = true;
	var rect = ev.target.getBoundingClientRect() ;
	if(!createS){
		alert("Please press button 'Create SOR'");
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
	else{
		check(ev);
		if(clickedBG == true && transformationDone == false && transformObjectXYZ == true ){
			transformationDone = true;
			transformObjectXYZ = false;
			clickedBG = false;
			var x = ev.clientX; // x coordinate of a mouse pointer
			var y = ev.clientY; // y coordinate of a mouse pointer
	  		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

			x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

			
			listOfObjects[0].transformObject(x, y);
		}
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
		var drawnObject = new SORObject(vertices, indexes, [0.0, 1.0, 0.0, (objectCounter/255)]);
		listOfObjects.push(drawnObject);
		drawnObject.calculateVNormals()
		masterYellow = true;
		YCube = new yellowCube(gl);
	}
	else{
		if(!camlClick && clickedBG){
			camlClick = true;
			clickedBG = false;
		}
		else{
			camlClick = false;
		}
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
	else if(clickedBG && endRightClick && !orthoproj && !camlClick){
		
		var x = ev.clientX;
		var y = ev.clientY;

		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

		var dx = x - oldX;
		var dy = y - oldY;
		if(Math.abs(dy) < Math.abs(dx)){
			if(x - oldX < 0){
				PangX += -0.02;
			}
			else{
				PangX += 0.02;
			}
		}
		else{
			if(y - oldY < 0){
				PangY += -0.02;
			}
			else{
				PangY += 0.02;
			}
		}
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

	 	for(var i = 0; i < listOfObjects.length; i ++){
	 		listOfObjects[i].renderColor();
		}
		YCube = new yellowCube(gl);
	}
	else if (clickedBG && endRightClick && orthoproj && !camlClick ){
		var x = ev.clientX;
		var y = ev.clientY;

		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

		var dx = x - ortOldX;
		var dy = y - ortOldY;
		if(Math.abs(dy) < Math.abs(dx)){
			if(x - ortOldX < 0){
				ortPangX += -0.02;
			}
			else{
				ortPangX += 0.02;
			}
		}
		else{
			if(y - ortOldY < 0){
				ortPangY += -0.02;
			}
			else{
				ortPangY += 0.02;
			}
		}
		ortOldX = x;
		ortOldY = y;

		mvpMatrix.setOrtho(-1, 1, -1, 1, -1, 1);
		mvpMatrix.setTranslate(-ortPangX, -ortPangY, -1+ortInNOut);

		gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);


		orthoproj = true;
		for(var i = 0; i < listOfObjects.length; i ++){
	 		listOfObjects[i].renderColor();
		}
		YCube = new yellowCube(gl);
	}
	else if ((transformObjectXYZ == true) && (transformationDone == false)){
		var x = ev.clientX;
		var y = ev.clientY;

		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

		//transformationDone = true;

		listOfObjects[0].transformObject(x, y);
		listOfObjects[0].transX = 0;
		listOfObjects[0].transY = 0;
	
	}
}

function Zoom(ev){
	ev.preventDefault();
	if(clickedBG && endRightClick && !orthoproj && !camlClick){

		var modelMatrix = new Matrix4(); // Model matrix
		var viewMatrix = new Matrix4();  // View matrix
		var projMatrix = new Matrix4();  // Projection matrix
		//var mvpMatrix = new Matrix4();   // Model view projection matrix

		// Calculate the model, view and projection matrices
		modelMatrix.setTranslate(0, 0, inNOut);
		viewMatrix.setLookAt(PangX, PangY, 4.5, 0, 0, -50, 0, 1, 3);
		projMatrix.setPerspective(defFOV + ev.deltaY, canvas.width/canvas.height, 1, 100);
		defFOV = defFOV + ev.deltaY;
		// Calculate the model view projection matrix
		mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
		// Pass the model view projection matrix to u_MvpMatrix
		gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

	 	for(var i = 0; i < listOfObjects.length; i ++){
	 		listOfObjects[i].renderColor();
		}
		YCube = new yellowCube(gl);
	}
	else if(clickedBG && endRightClick && !orthoproj && inNOutBool && !camlClick){
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

	 	for(var i = 0; i < listOfObjects.length; i ++){
	 		listOfObjects[i].renderColor();
		}
		YCube = new yellowCube(gl);
	}
	else if(clickedBG && endRightClick && orthoproj && ortInNOutBool && !camlClick){
		ortInNOut += ev.deltaY/30;
		mvpMatrix.setOrtho(-1, 1, -1, 1, -1, 1);
		mvpMatrix.setTranslate(-ortPangX, -ortPangY, -1 + ortInNOut);

		gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

		for(var i = 0; i < listOfObjects.length; i ++){
	 		listOfObjects[i].renderColor();
		}
		YCube = new yellowCube(gl);
	}

}

function check(ev){
	var pixels = new Uint8Array(4);
	gl.readPixels(ev.clientX - 13, canvas.height - ev.clientY+ 15, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	
	if(endRightClick == true){
		if(((pixels[0]+pixels[1]+pixels[2])/3 == 255 ) && (pixels[3]==255 ) ){
			clickedBG = true;
			camlClick = false;
			console.log("Turning On Back Groud");
			}
		for(var i = 1; i < listOfObjects.length+1; i ++){
 			var objNo = listOfObjects[i].objColor[3];
			if(pixels[3] == 255- i*5 ){
				console.log(" object ", i," was selected");
			}
		}
	}
}

function mouseDown(ev){

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
	else if(ev.which == 1 && pixels[3] == 250 ){
		var x = ev.clientX;
		var y = ev.clientY;
		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

		listOfObjects[0].transX = x;
		listOfObjects[0].transY = y;

		transformObjectXYZ = true;
		transformationDone = false;

		listOfObjects[0].transformObject(x, y);
	}
}
/*function mouseup(ev){
	if(transformObjectXYZ == true && transformationDone == false){
		var x = ev.clientX;
		var y = ev.clientY;

		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

		transformationDone = true;

		listOfObjects[0].transformObject(x, y);
		listOfObjects[0].transX = 0;
		listOfObjects[0].transY = 0;
	}
}*/
