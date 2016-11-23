function SORObject(Vertices, Indexes, Color){
	var verts = [];
	for(var i = 0; i < Vertices.length; i += 3){
		var xyzComp = new xyzValues(Vertices[i],
					Vertices[i+1],
					Vertices[i+2]);
		verts.push(xyzComp);
	}

	// Get the storage location of u_MvpMatrix
	this.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	if (!this.u_MvpMatrix) {
		console.log('Failed to get the storage location of u_MvpMatrix');
		return;
	}
	this.objectId = objectCounter;

	this.mvpMatrix = new Matrix4();   // Model view projection matrix


	this.color = [];

	this.vertices = verts ;
	this.indexes = Indexes ;
	this.objColor = Color ;
	this.ver ;

	this.transX;
	this.transY;
	this.translation = new xyzValues(0, 0, 0);;
	this.rotation ;
	this.scaling ;
}

SORObject.prototype.calculateVNormals = function(){

	var len = this.vertices.length;

	var lvls = len/ 144 ;

	this.normals = [];
	for(var i = 0 ; i < len ; i += 4){
		if(i == 0 ){
			var normal1 = pointsToNormals(this.vertices[i+3], this.vertices[i],this.vertices[i+1] );
			var normal2 = pointsToNormals(this.vertices[i], this.vertices[i+1],this.vertices[i+2] );
			var n_3_1 = pointsToNormals(this.vertices[i+1], this.vertices[i+2],this.vertices[i+3] );
			var n_3_2 = pointsToNormals(this.vertices[i+4], this.vertices[i+5],this.vertices[i+6] );

			var n_4_1 = pointsToNormals(this.vertices[i], this.vertices[i+3], this.vertices[i+2] );
			var n_4_2 = pointsToNormals(this.vertices[i+7], this.vertices[i+4],this.vertices[i+5] );

			var normal3 = [n_3_1[0]+n_3_2[0],n_3_1[1]+n_3_2[1], n_3_1[2]+n_3_2[2] ];
			var normal4 = [n_4_1[0]+n_4_2[0],n_4_1[1]+n_4_2[1], n_4_1[2]+n_4_2[2] ];
			this.normals.push(normal1, normal2, normal3, normal4);
		}
		else if(i+4 == len){
			var n_1_1 = this.normals[this.normals.length-2];
			var n_1_2 = pointsToNormals(this.vertices[i+3], this.vertices[i], this.vertices[i+1]);

			var normal1 = [n_1_1[0]+n_1_2[0],n_1_1[1]+n_1_2[1], n_1_1[2]+n_1_2[2] ];
			this.normals[this.normals.length-1] = normal1;

			var n_2_1 = this.normals[this.normals.length-2];
			var n_2_2 = pointsToNormals(this.vertices[i], this.vertices[i+1], this.vertices[2]);
			var normal2 = [n_2_1[0]+n_2_2[0],n_2_1[1]+n_2_2[1], n_2_1[2]+n_2_2[2] ];
			this.normals[this.normals.length-2] = normal2;


			var normal3 = pointsToNormals(this.vertices[i+1], this.vertices[i+2], this.vertices[i+3]);


			var normal4 = pointsToNormals(this.vertices[i+2], this.vertices[i+3], this.vertices[i]);


			this.normals.push(normal1, normal2, normal3, normal4);

		}
		else{
			//var normal1 = pointsToNormals(this.vertices[i+3], this.vertices[i], this.vertices[i+1]);
			var n_1_1 = this.normals[this.normals.length-1];
			var n_1_2 = pointsToNormals(this.vertices[i+3], this.vertices[i], this.vertices[i+1]);
			var normal1 = [n_1_1[0]+n_1_2[0],n_1_1[1]+n_1_2[1], n_1_1[2]+n_1_2[2] ];
			this.normals[this.normals.length-1] = normal1;

			//var normal2 = pointsToNormals(this.vertices[i], this.vertices[i+1], this.vertices[i+2]);
			var n_2_1 = this.normals[this.normals.length-2];
			var n_2_2 = pointsToNormals(this.vertices[i], this.vertices[i+1], this.vertices[i+2]);
			var normal2 = [n_2_1[0]+n_2_2[0],n_2_1[1]+n_2_2[1], n_2_1[2]+n_2_2[2] ];
			this.normals[this.normals.length-2] = normal2;

			var n_3_1 = pointsToNormals(this.vertices[i+1], this.vertices[i+2], this.vertices[i+3]) ;
			var n_3_2 = pointsToNormals(this.vertices[i+4], this.vertices[i+5], this.vertices[i+6]) ;
			var normal3 = [n_3_1[0]+n_3_2[0],n_3_1[1]+n_3_2[1], n_3_1[2]+n_3_2[2] ];

			var n_4_1 = pointsToNormals(this.vertices[i+2], this.vertices[i+3], this.vertices[i]) ;
			var n_4_2 = pointsToNormals(this.vertices[i], this.vertices[i+4], this.vertices[i+6]);
			var normal4 = [n_4_1[0]+n_4_2[0],n_4_1[1]+n_4_2[1], n_4_1[2]+n_4_2[2] ];

			this.normals.push(normal1, normal2, normal3, normal4);
		}

	}
	this.renderColor();
	return(this.normals);
}

SORObject.prototype.renderColor = function(){
	var clen = this.normals.length

	for(var k = 0; k < clen; k ++){
		var faceColor = colorPoly(this.objColor, [1.0, 1.0, 1.0] , this.normals[k], [1.0, 1.0, 1.0]);
		this.color.push(faceColor[0], faceColor[1], faceColor[2], (this.objectId/255));
	}
	this.grey = [];
	for(var i = 0 ; i < this.color.length; i += 3){
		this.grey.push(0.5, 0.5, 0.5, this.objectId/255);

	}
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER);
	var vlen = this.vertices.length;
	var ver = [];
	for(var i = 0; i < vlen; i ++){
		ver.push(this.vertices[i].x, this.vertices[i].y, this.vertices[i].z);
	}
	this.ver = ver.slice(0) ;

	var n = drawSOR(gl, ver, this.indexes, this.color);
	// Clear color and depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);

	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}

SORObject.prototype.transformObject = function(deltaX, deltaY){

		//var n = drawSOR(gl, this.ver, this.indexes, this.grey);

		if(transformationDone == true){
			console.log("Translating!");
			var deltVals = getDeltaValues(this.transX, this.transY, deltaX, deltaY);
			this.translation.x = deltVals[0] ;
			this.translation.y = deltVals[1] ;
			console.log(this.translation.x, this.translation.y);

			this.transX = deltaX;
			this.transY = deltaY;

			this.mvpMatrix.setTranslate(this.translation.x , this.translation.y, -1);

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			gl.enable(gl.DEPTH_TEST);

			var n = drawSOR(gl, this.ver, this.indexes, this.color);
			// Pass the model view projection matrix to u_MvpMatrix
			gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements);
		}
		else if(transformationDone == false ){
			var deltVals = getDeltaValues(this.transX, this.transY, deltaX, deltaY);
			this.translation.x = deltVals[0] ;
			this.translation.y = deltVals[1] ;

			this.transX = deltaX;
			this.transY = deltaY;

			this.mvpMatrix.setTranslate(this.translation.x , this.translation.y, -1);

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			gl.enable(gl.DEPTH_TEST);

			var n = drawSOR(gl, this.ver, this.indexes, this.grey);
			// Pass the model view projection matrix to u_MvpMatrix
			gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements);
		}

		gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}


//Yellow Cube drawing function
function yellowCube(gl){
  this.verticesColors = new Float32Array([
    // Vertex coordinates and color
      0.050,  1.0,  0.050,     1.0,  1.0,  0.0,  // v0 Yellow
      -0.050,  1.0,  0.050,     1.0,  1.0,  0.0,  // v1 Yellow
      -0.050, 0.95,  0.050,     1.0,  1.0,  0.0,  // v2 Yellow
      0.050, 0.950,  0.050,     1.0,  1.0,  0.0,  // v3 Yellow

      0.050,  0.950, -0.050,     1.0,  1.0,  0.0,  // v4 Yellow
      0.050,  1.0, -0.050,     1.0,  1.0,  0.0,  // v5 Yellow
      -0.050, 1.0, -0.050,     1.0,  1.0,  0.0,  // v6 Yellow
      -0.050, 0.950, -0.050,     1.0,  1.0,  0.0  // v7 Yellow
    ]);
  // Indices of the vertices
  this.indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    0, 3, 4,   0, 4, 5,    // right
    0, 5, 6,   0, 6, 1,    // up
    1, 6, 7,   1, 7, 2,    // left
    7, 4, 3,   7, 3, 2,    // down
    4, 7, 6,   4, 6, 5     // back
  ]);
  // Create a buffer object
  this.vertexColorBuffer = gl.createBuffer();
  this.indexBuffer = gl.createBuffer();
  if (!this.vertexColorBuffer || !this.indexBuffer) {
    return -1;
  }
  // Write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.verticesColors, gl.STATIC_DRAW);

  this.FSIZE = this.verticesColors.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  this.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(this.a_Position, 3, gl.FLOAT, false, this.FSIZE * 6, 0);
  gl.enableVertexAttribArray(this.a_Position);
  //Assign the buffer object to a_Color and enable the assignment
  this.a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(this.a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(this.a_Color, 3, gl.FLOAT, false, this.FSIZE * 6, this.FSIZE * 3);
  gl.enableVertexAttribArray(this.a_Color);

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

  //return indices.length;
  this.renderColor();
}

yellowCube.prototype.renderColor = function(){
	var m = this.indices.length ;
    // Draw the cube
    gl.drawElements(gl.TRIANGLES, m, gl.UNSIGNED_BYTE, 0);

}
