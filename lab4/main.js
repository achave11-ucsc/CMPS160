function main() {
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');
	Rangex = document.getElementById('myRangeX');
  	Rangey = document.getElementById('myRangeY');
	// Get the rendering context for WebGL
	gl =  WebGLUtils.setupWebGL(canvas,{preserveDrawingBuffer: true})
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}
	// Create a buffer object
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer){
		console.log('Failed to create the buffer object');
		return -1;
	}
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}
	// Get the storage location of u_MvpMatrix
	u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	if (!u_MvpMatrix) {
		console.log('Failed to get the storage location of u_MvpMatrix');
		return;
	}

	// Set the eye point and the viewing volume
	mvpMatrix = new Matrix4();
	//mvpMatrix.setPerspective(30, 1, 1, 100);
	mvpMatrix.setOrtho(-1, 1, -1, 1, -1, 1); // USE THIS FUNCTION FOR IN GENERAL 4 VIEWING
	
	defFOV = 30;	
	
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

}
