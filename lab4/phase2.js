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
    mvpMatrix.setOrtho(-500, 500, -500, 500, -500, 500);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    orthoproj = true;
    for(var i = 0; i < listOfObjects.length; i ++){
 		listOfObjects[i].renderColor();
    }
  }
  else if(orthoproj){
  	console.log("Ortho was on, now is off!");
    mvpMatrix.lookAt(-3, 10, 10, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    orthoproj = false;
 	for(var i = 0; i < listOfObjects.length; i ++){
 		listOfObjects[i].renderColor();
    }
  }
}
