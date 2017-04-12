// Function that generates SOR,
function SORGenerator(){
	for(var i = 0; i < 370; i += 10){
	  	var len = originalCoords.length;
	  	var array_0 = [];
	  	if(i ==0){
	  		var coords_temp = originalCoords.slice(0);
	    	}
	    	for(var j=0; j< len; j += 1 ){
      			var x1 = coords_temp[j].x ;
      			var y1 = coords_temp[j].y ;
			var z1 = coords_temp[j].z ;

			var x2 = x1*cosine(i) + z1* sine(i);
			var y2 = y1 ;
      			var z2 = -x1*sine(i) + z1*cosine(i);

			var XYZ_i = new xyzValues(x2, y2, z2);
   	   		array_0.push(XYZ_i);
		}
    		rotationMasterArray.push(array_0);
	}
	return rotationMasterArray;
}

// Calculates vertices and indexes for SOR that was drawn
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
		}
	}
}

//calculates the normals of a given SOR
function pointsToNormals(Point1, Point2, Point3){
  var Vect1 = [Point1.x - Point2.x, Point1.y - Point2.y, Point1.z - Point2.z];
  var v1 = new xyzValues(Vect1[0],Vect1[1],Vect1[2]);

  var Vect2 = [Point3.x - Point2.x, Point3.y - Point2.y, Point3.z - Point2.z];
  var v2 = new xyzValues(Vect2[0], Vect2[1], Vect2[2]);

  var x = (v2.y * v1.z) - (v2.z * v1.y) ;
  var y = (v2.z * v1.x) - (v2.x * v1.z) ;
  var z = (v2.x * v1.y) - (v2.y * v1.x) ;

  var mag = Math.sqrt(x*x + y*y + z*z);

  return [x/mag, y/mag, z/mag];
}

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
}

function renderScene(bool){
    var len = listOfObjects.length;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for(var i = 0; i < len; i ++){

        var currentBool = listOfObjects[i].bool;
        if(!bool){
            listOfObjects[i].renderColor(bool);
        }
        else {
            listOfObjects[i].renderColor(currentBool);
        }
    }
    var lghts = lightSources.length;
    for(var j= 0; j < lghts; j ++ ){
        lightSources[j].renderColor();
    }
}