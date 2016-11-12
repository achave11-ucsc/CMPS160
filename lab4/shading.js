
/*
function flatShade(){
  if(!flatShader){
    flatShader = true;
    mouseMove(10);
  }
  else{
    flatShader=false;
    mouseMove(10);
  }
}
//Function that handles click to change projection!
function changeProjection(ev){
  if(!orthoproj){
    mvpMatrix.setOrtho(-500, 500, -500, 500, -500, 500);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    orthoproj = true;
    mouseMove(10);
  }
  else if(orthoproj){
    mvpMatrix.lookAt(-3, 10, 10, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    orthoproj = false;
    mouseMove(10);
  }
}

//Event handler, when mouse is clicked!
function mouseDown(ev){

	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect() ; //Normalize canvas
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2) * 500; // x - according to drawn canvas
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2) * 500;// y - according to drawn canvas

  var coords1 = new XYZcomponents(x,y,0);
  coordinates.push(coords1);
  if(ev.which == 1 &&( rightClick.length != 2)){
		points.push(x, y);
	}


	else if(ev.which == 3 &&( rightClick.length != 2)){
      points.push(x, y);
      rightClick.push(x, y);

      SORGenerator();
	  yellowOn = true;
    redOn = true;
    orthoproj = true;
    flatShader = false;
	}

  else if(ev.which == 1 &&( rightClick.length == 2)){
    if((-30 < x ) && (x <= 30) && (y > 470) && (y < 500)){
      if(yellowOn){
        yellowOn = false;
      }
      else{
        yellowOn = true;
      }
    }
    else if(((x-y > -10) && (x-y < 10)) || (((x-10)-y < 10) && ((x-10)-y > -10) )){
      if(redOn){
        redOn = false;
      }
      else{
        redOn = true;
      }
    }
  }
}
*/

/*
// Function that calculates vertecies
function calcVertices() {
  for (var i = 0; i < rotationMasterArray[0].length - 1; i++) {
    for (j = 0; j < rotationMasterArray.length - 1; j++) {

      var index = (vertices.length / 3);

      var currentLine = rotationMasterArray[j];
      var nextLine = rotationMasterArray[j + 1];

      vertices.push(currentLine[i].x, currentLine[i].y, currentLine[i].z);
      vertices.push(currentLine[i + 1].x, currentLine[i + 1].y, currentLine[i + 1].z);
      vertices.push(nextLine[i + 1].x, nextLine[i + 1].y, nextLine[i + 1].z);
      vertices.push(nextLine[i].x, nextLine[i].y, nextLine[i].z);

      indexes.push(index, index + 1, index + 2);
      indexes.push(index, index + 2, index + 3);

      var faceColor = pointsToNormals(currentLine[i], currentLine[i+1], nextLine[i]);
      flatNormal.push(faceColor, faceColor, faceColor, faceColor);

      if (j+2 != rotationMasterArray.length){
        var thirdLine = rotationMasterArray[j+ 2];
        if(j == 0){
          var prevLine = rotationMasterArray[rotationMasterArray.length-1];
          var v1_0Normal = pointsToNormals(prevLine[i], currentLine[i], currentLine[i+1]);

        }
        else if (j > 0){
          var prevLine = rotationMasterArray[j-1];
          var v1_0Normal = [0,0,0];

        }
      }
      else {
        var thirdLine = rotationMasterArray[0];
      }
      var v1_1Normal = pointsToNormals(nextLine[i], currentLine[i], currentLine[i+1]);
      var v1Normal = [v1_1Normal[0]+v1_0Normal[0], v1_1Normal[1]+v1_0Normal[1], v1_1Normal[2]+v1_0Normal[2] ];



      var v4_0Normal = [0, 0, 0];
      var v4_1Normal = pointsToNormals(thirdLine[i], nextLine[i], nextLine[i+1]);
      var v4Normal = [v4_0Normal[0] + v4_1Normal[0] , v4_0Normal[1] + v4_1Normal[1] , v4_0Normal[2] + v4_1Normal[2]];

      if(i+2 == rotationMasterArray[0].length){
        var v2Normal = pointsToNormals(currentLine[i], currentLine[i+1], nextLine[i+1]);
        var v3_0Normal = [0,0,0];/*pointsToNormals(currentLine[i], nextLine[i+1], nextLine[i]);
        var v3_1Normal = pointsToNormals(nextLine[i], nextLine[i+1], thirdLine[i+1]);
        var v3Normal = [v3_0Normal[0]+v3_1Normal[0], v3_0Normal[1]+v3_1Normal[1], v3_0Normal[2]+v3_1Normal[2]];
      }
      else{
        var v2_0Normal = pointsToNormals(currentLine[i], currentLine[i+1], nextLine[i+1]);
        var v2Normal = [v2_0Normal[0], v2_0Normal[1], v2_0Normal[2]];

        var v3_1Normal = pointsToNormals(nextLine[i], nextLine[i+1], thirdLine[i+1]);

        var v3Normal = [v3_1Normal[0],
                        v3_1Normal[1],
                        v3_1Normal[2]];
      }
      vertexNormal.push(v1Normal, v2Normal, v3Normal, v4Normal);

    }
  }
}*/
/*
// Function that colors the polygonal faces by point
function colorPoly(ObjCol, LightColr , Normal, ColorVect ){

  var magNorm = Math.sqrt(Normal[0]*Normal[0] + Normal[1]*Normal[1]+ Normal[2]*Normal[2]);
  var magColV = Math.sqrt(ColorVect[0]*ColorVect[0] + ColorVect[1]*ColorVect[1]+ ColorVect[2]*ColorVect[2]);
  var unitVect = [Normal[0], Normal[1], Normal[2]];
  var dotProd = (unitVect[0]*ColorVect[0] + unitVect[1]*ColorVect[1] + unitVect[2]*ColorVect[2]);

  var costhet = ( dotProd / (magNorm+magColV) ) ;

  var r = ObjCol[0]*costhet*LightColr[0];
  var g = ObjCol[1]*costhet*LightColr[1];
  var b = ObjCol[2]*costhet*LightColr[2];

  if(r > 1){
    r =1;
  }
  else if (r < 0) {
    r = 0;
  }
  if(g > 1){
    g =1;
  }
  else if (g < 0) {
    g = 0;
  }
  if(b > 1){
    b = 1;
  }
  else if (b < 0) {
    b = 0;
  }
  return [r,g,b];
}*/

/*
// Function that collects 3 points and generates a normal vector from it
function pointsToNormals(Point1, Point2, Point3){
  var Vect1 = [Point1.x - Point2.x, Point1.y - Point2.y, Point1.z - Point2.z];
  var v1 = new XYZcomponents(Vect1[0],Vect1[1],Vect1[2]);

  var Vect2 = [Point3.x - Point2.x, Point3.y - Point2.y, Point3.z - Point2.z];
  var v2 = new XYZcomponents(Vect2[0], Vect2[1], Vect2[2]);

  var x = (v2.y * v1.z) - (v2.z * v1.y) ;
  var y = (v2.z * v1.x) - (v2.x * v1.z) ;
  var z = (v2.x * v1.y) - (v2.y * v1.x) ;

  var mag = Math.sqrt(x*x + y*y + z*z);

  return [x/mag, y/mag, z/mag];
}*/
/*
// Binds all the buffers, vertecies, colors and indexes.
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

}*/


//Event handler, draws rubber band line between the last point clicked and the current mouse position
/*function mouseMove(ev){
  var canvas = document.getElementById('webgl');

  if(rightClick.length == 2 && counter != 1){
    (gl);
    drawPoints(gl, points);
    calcVertices();
    counter = 1;
      //
  }
  else if(rightClick.length == 0 && (points.length > 0)){

    var temp_y = points.pop();
    var temp_x = points.pop();
    points.push(temp_x);
    points.push(temp_y);
    drawPoints(gl, points);
    var rect = ev.target.getBoundingClientRect();
    var x = ev.clientX;
    var y = ev.clientY;
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2) * 500;
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2) * 500;
		//Obtained the once from the mouse click and actively changing onnes
    rubber.push(temp_x);
    rubber.push(temp_y);
    rubber.push(x);
    rubber.push(y);
    // Clear images
    //gl.clear(gl.COLOR_BUFFER_BIT);
    var len = rubber.length;
    var n = bindBuffer(gl , rubber, 2);
    gl.drawArrays(gl.LINES, 0, n);
    for(var i =0 ; i < len ; i +=1){
      rubber.pop();
      rubber.pop();
    }
  }
  else if (counter == 1 &&(t_counter ==0)){
    drawPoints(gl, points);
    t_counter = 1;
  }
  else if(counter==1 && ( t_counter ==1)) {
    if(!redOn && !yellowOn){
      if(!flatShader){
        colors = [];
        var len = vertexNormal.length;
        for(var i = 0; i < len ; i ++){
          var touple = colorPoly( [0.20, .20, .20], [1,1,1], vertexNormal[i], [200,200,200]);
          colors.push(touple[0], touple[1], touple[2]);
        }
        gl.clearColor(1.0, 1.0, 1.0, .50);
      }
    else{
      colors = [];
      var len = flatNormal.length;
      for(var i = 0; i < len ; i ++){
        var touple = colorPoly( [0.20, .20, .20], [1,1,1], flatNormal[i], [200,200,200]);
        colors.push(touple[0], touple[1], touple[2]);
      }
      gl.clearColor(1.0, 1.0, 1.0, .50);
      }
    }

    else if (redOn && yellowOn) {
      colors = [];
      if(!flatShader){
        var len = vertexNormal.length;
        for(var i = 0; i < len ; i ++){
          var touple = colorPoly( [0.0, 1.0, .50], [1,1,1], vertexNormal[i], [150,150,150]);
          var magn = Math.sqrt(vertices[i*3]*vertices[i*3] + vertices[i*3+1]*vertices[i*3+1] + vertices[i*3+2]*vertices[i*3+2]);
          var pointVect = colorPoly([1.0, 1.0, .0], [1, 1, 0], vertexNormal[i] ,[0- (vertices[i*3]/magn), 500 - (vertices[i*3 + 1]/ magn), 0 - (vertices[i*3+2]/ magn) ]);
          colors.push(touple[0]+pointVect[0], touple[1] + pointVect[1], touple[2]+[pointVect[2]]);
        }
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
      }
      else{
        var len = flatNormal.length;
        for(var i = 0; i < len ; i ++){
          var touple = colorPoly( [0.0, 1.0, .50], [1,1,1], flatNormal[i], [150,150,150]);
          var magn = Math.sqrt(vertices[i*3]*vertices[i*3] + vertices[i*3+1]*vertices[i*3+1] + vertices[i*3+2]*vertices[i*3+2]);
          var pointVect = colorPoly([1.0, 1.0, .0], [1, 1, 0], flatNormal[i] ,[0- (vertices[i*3]/magn), 500 - (vertices[i*3 + 1]/ magn), 0 - (vertices[i*3+2]/ magn) ]);
          colors.push(touple[0]+pointVect[0], touple[1] + pointVect[1], touple[2]+[pointVect[2]]);
        }
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
      }
    }
    else if (redOn && !yellowOn){
      if(!flatShader){
        colors = [];
        var len = vertexNormal.length;
        for(var i = 0; i < len ; i ++){
          var touple = colorPoly( [0.0, 1.0, .50], [1,1,1], vertexNormal[i], [150,150,150]);
          colors.push(touple[0], touple[1] , touple[2] );
        }
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
      }
      else{
        colors = [];
        var len = flatNormal.length;
        for(var i = 0; i < len ; i ++){
          var touple = colorPoly( [0.0, 1.0, .50], [1,1,1], flatNormal[i], [150,150,150]);
          colors.push(touple[0], touple[1] , touple[2] );
        }
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
      }
    }
    else if (!redOn && yellowOn){
      if(!flatShader){
        colors = [];
        var len = vertexNormal.length;
        for(var i = 0; i < len ; i ++){
          var magn = Math.sqrt(vertices[i*3]*vertices[i*3] + vertices[i*3+1]*vertices[i*3+1] + vertices[i*3+2]*vertices[i*3+2]);
          var pointVect = colorPoly([1.0, 1.0, .0], [1, 1, 0], vertexNormal[i] ,[0- (vertices[i*3]), 500 - (vertices[i*3 + 1]/ magn), 0 - (vertices[i*3+2]/ magn) ]);
          colors.push(pointVect[0], pointVect[1], [pointVect[2]]);
        }
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
      }
      else{
        colors = [];
        var len = flatNormal.length;
        for(var i = 0; i < len ; i ++){
          var magn = Math.sqrt(vertices[i*3]*vertices[i*3] + vertices[i*3+1]*vertices[i*3+1] + vertices[i*3+2]*vertices[i*3+2]);
          var pointVect = colorPoly([1.0, 1.0, .0], [1, 1, 0], flatNormal[i] ,[0- (vertices[i*3]), 500 - (vertices[i*3 + 1]/ magn), 0 - (vertices[i*3+2]/ magn) ]);
          colors.push(pointVect[0], pointVect[1], [pointVect[2]]);
        }
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
      }
    }

    var n = drawSOR(gl, vertices, indexes, colors);
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

    var m = yellowCube(gl, yellowOn);
    // Draw the cube
    gl.drawElements(gl.TRIANGLES, m, gl.UNSIGNED_BYTE, 0);

    var k = redLiNE(gl, redOn);

    gl.drawElements(gl.LINE_STRIP, k, gl.UNSIGNED_BYTE, 0);
  }
}*/

//Yellow Cube drawing function
/*function yellowCube(gl, bool){
  if (bool){
    var verticesColors = new Float32Array([
    // Vertex coordinates and color
      25.0,  500.0,  25.0,     1.0,  1.0,  0.0,  // v0 Yellow
      -25.0,  500.0,  25.0,     1.0,  1.0,  0.0,  // v1 Yellow
      -25.0, 475.0,  25.0,     1.0,  1.0,  0.0,  // v2 Yellow
      25.0, 475.0,  25.0,     1.0,  1.0,  0.0,  // v3 Yellow

      25.0,  475.0, -25.0,     1.0,  1.0,  0.0,  // v4 Yellow
      25.0,  500.0, -25.0,     1.0,  1.0,  0.0,  // v5 Yellow
      -25.0, 500.0, -25.0,     1.0,  1.0,  0.0,  // v6 Yellow
      -25.0, 475.0, -25.0,     1.0,  1.0,  0.0  // v7 Yellow
    ]);
  }
  else{
    var verticesColors = new Float32Array([
    // Vertex coordinates and color
      25.0,  500.0,  25.0,     .50,  .50,  0.50,  // v0 Gray
      -25.0,  500.0,  25.0,    .50,  .50,  0.50,  // v1 Gray
      -25.0, 475.0,  25.0,     .50,  .50,  0.50,  // v2 Gray
      25.0, 475.0,  25.0,      .50,  .50,  0.50,  // v3 Gray

      25.0,  475.0, -25.0,    .50,  .50,  0.50,  // v4 Gray
      25.0,  500.0, -25.0,    .50,  .50,  0.50,  // v5 Gray
      -25.0, 500.0, -25.0,    .50,  .50,  0.50,  // v6 Gray
      -25.0, 475.0, -25.0,    .50,  .50,  0.50  // v7 Gray
    ]);
  }
    // Indices of the vertices
  var indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    0, 3, 4,   0, 4, 5,    // right
    0, 5, 6,   0, 6, 1,    // up
    1, 6, 7,   1, 7, 2,    // left
    7, 4, 3,   7, 3, 2,    // down
    4, 7, 6,   4, 6, 5     // back
  ]);
  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();
  var indexBuffer = gl.createBuffer();
  if (!vertexColorBuffer || !indexBuffer) {
    return -1;
  }
  // Write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  //Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}*/

/*
// Red Line drawing function
function redLiNE(gl, bool){
  if(bool){
    var vertices = new Float32Array([
      0.0, 0.0 ,0.0, 1.0, 0.0, 0.0,
      500, 500, 500, 1.0, 0.0, 0.0
    ]);
  }
  else{
    var vertices = new Float32Array([
      0.0, 0.0 ,0.0, .40, .40, 0.40,
      500, 500, 500, .40, .40, 0.40
    ]);
  }
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer ) {
    return -1;
  }
  // Write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var FSIZE = vertices.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  //Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return 2;

  // Write the indices to the buffer object
}

*/
