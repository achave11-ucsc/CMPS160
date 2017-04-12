//Yellow Cube drawing function
function yellowCube(){
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
    // Get the storage location of u_MvpMatrix
    this.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!this.u_MvpMatrix) {
        console.log('Failed to get the storage location of u_MvpMatrix');
        return;
    }

    this.mvpMatrix = new Matrix4();
    // Create a buffer object
    this.vertexColorBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    if (!this.vertexColorBuffer || !this.indexBuffer) {
        return -1;
    }

    this.FSIZE = this.verticesColors.BYTES_PER_ELEMENT;
    // Assign the buffer object to a_Position and enable the assignment
    this.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    //Assign the buffer object to a_Color and enable the assignment
    this.a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(this.a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }



  //this.renderColor();
}

yellowCube.prototype.renderColor = function(){
    if(orthoproj){
        this.mvpMatrix.setTranslate(-ortPangX , -ortPangY, -1);
        gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements);
    }
    else if(!orthoproj){
        //this.mvpMatrix.setTranslate(, , -1);

        var modelMatrix = new Matrix4(); // Model matrix
        var viewMatrix = new Matrix4();  // View matrix
        var projMatrix = new Matrix4();  // Projection matrix

        // Calculate the model, view and projection matrices
        modelMatrix.setTranslate(0 , 0, inNOut);
        viewMatrix.setLookAt(PangX, PangY, 4.5, 0, 0, -50, 0, 1, 3);
        projMatrix.setPerspective(defFOV, canvas.width/canvas.height, 1, 100);

        // Calculate the model view projection matrix
        this.mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        // Pass the model view projection matrix to u_MvpMatrix
        gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements);
    }
    // Write the vertex coordinates and color to the buffer object


    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.verticesColors, gl.STATIC_DRAW);


    gl.vertexAttribPointer(this.a_Position, 3, gl.FLOAT, false, this.FSIZE * 6, 0);
    gl.enableVertexAttribArray(this.a_Position);

    gl.vertexAttribPointer(this.a_Color, 3, gl.FLOAT, false, this.FSIZE * 6, this.FSIZE * 3);
    gl.enableVertexAttribArray(this.a_Color);


    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);


    var m = this.indices.length ;
    // Draw the cube
    gl.drawElements(gl.TRIANGLES, m, gl.UNSIGNED_BYTE, 0);

}
