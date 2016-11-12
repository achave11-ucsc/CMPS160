function createSOR(){
	createS = true;
}

function lClick(ev){
	if(/*!createS*/false){
		createSOR();
		//alert("Please press button 'Create SOR'");	
	}
	else if(!endRightClick /*&& createS*/){
		var x = ev.clientX; // x coordinate of a mouse pointer
		var y = ev.clientY; // y coordinate of a mouse pointer
  		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas
	
		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2)* 500;
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2)* 500;
		
		var coords = new xyzValues(x, y, 0);
		originalCoords.push(coords);

		points.push(x, y);
	
		if (points.length > 2 ){
			drawPoints();		
		}
	}
	else{
		console.log("Clicking has ended!");
	}
}	


function rClick(ev){
	ev.preventDefault();
	
	if(!endRightClick){	
		var x = ev.clientX; // x coordinate of a mouse pointer
		var y = ev.clientY; // y coordinate of a mouse pointer
  		var rect = ev.target.getBoundingClientRect() ; //Normalize canvas
		
		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2) * 500;
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2)* 500;		
		
		var coords = new xyzValues(x, y, 0);
		originalCoords.push(coords);		
	
		endRightClick = true; 	
		points.push(x, y);
		if (points.length > 2 ){
			drawPoints();		
		}
		SORGenerator();
		calcVertices();
		var drawnObject = new SORObject(vertices, indexes, [0.0, 1.0, 0.0]);
		listOfObjects.push(drawnObject);
		drawnObject.calculateVNormals()
			
	}
	else{
	console.log("Clicking has ended!");
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
		
		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2)* 500;
  		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2)* 500;
		
		var rubber = [tempX, tempY, x, y];
		
    		
		var n = bindBuffer(gl, rubber, 2);
    		gl.drawArrays(gl.LINES, 0, n);
	
	}
	else if(endRightClick){
	}
}
