//Simple way to store coordinates
function xyzValues(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}

// Implements cosine of given angle, returns transformation
function cosine(thetha){
	r = (thetha*Math.PI)/180;
	return Math.cos(r);
}

//Implements sin of given angle, returns transformation
function sine(thetha){
	r = (thetha*Math.PI)/180;
	return Math.sin(r);
}

//Binds array buffer to draw new elements
function bindBuffer(gl, PairOfPoints, lenOfVer) {
	var vertices = new Float32Array( PairOfPoints );
	var n = lenOfVer; // The number of vertices
	// Write date into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	return n;
}
//Draws the line segment that was created by the clicks registered
function drawPoints(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	var len = points.length;
	var n = bindBuffer(gl, points, len/2);
	gl.drawArrays(gl.LINE_STRIP, 0, n);
}

//Initializes an array buffer;
function initArrayBuffer(gl, data, num, type, attribute) {
	var buffer = gl.createBuffer();   // Create a buffer object
	if (!buffer) {
	  	console.log('Failed to create the buffer object');
	  	return false;
	}
	// Write date into the buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	// Assign the buffer object to the attribute variable
	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	if (a_attribute < 0) {
	  	console.log('Failed to get the storage location of ' + attribute);
	    	return false;
	}
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	// Enable the assignment of the buffer object to the attribute variable
	gl.enableVertexAttribArray(a_attribute);
	return true;
}
