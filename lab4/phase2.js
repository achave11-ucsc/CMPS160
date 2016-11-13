function drawSOR(gl, vertices, indexes, culors){


  var vertices = new Float32Array(vertices.slice(0));


  var colors = new Float32Array(culors.slice(0));     // Colors


  var indices = new Uint16Array(indexes.slice(0));

  var indexBuffer = gl.createBuffer();
  if (!indexBuffer)
    return -1;

  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
    return -1;

  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color'))
    return -1;

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}
//Function that handles click to change projection!

function changeProjection(ev){
  if(!orthoproj){
  	console.log("Ortho was off, now is one!");
  	mvpMatrix.lookAt(0, 0, 0, 0, 0, 0, 0, 1, 0);
    mvpMatrix.setOrtho(-1, 1, -1, 1, -1, 1);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    orthoproj = true;
    for(var i = 0; i < listOfObjects.length; i ++){
 		listOfObjects[i].renderColor();
    }
  }
  else if(orthoproj){
  	console.log("Ortho was on, now is off!");
    var modelMatrix = new Matrix4(); // Model matrix
	var viewMatrix = new Matrix4();  // View matrix
	var projMatrix = new Matrix4();  // Projection matrix
	//var mvpMatrix = new Matrix4();   // Model view projection matrix

	// Calculate the model, view and projection matrices
	modelMatrix.setTranslate(0.0, 0.0, 0);
	viewMatrix.setLookAt(0, 0, 4.5, 0, 0, -50, 0, 1, 3); 
	console.log(canvas.width, canvas.height);
	projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
	// Calculate the model view projection matrix
	mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
	// Pass the model view projection matrix to u_MvpMatrix
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    orthoproj = false;
 	for(var i = 0; i < listOfObjects.length; i ++){
 		listOfObjects[i].renderColor();
    }
  }
}
