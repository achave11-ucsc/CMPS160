function SORObject(Vertices, Indexes, Color){
	var verts = [];
	for(var i = 0; i < Vertices.length; i += 3){
		var xyzComp = new xyzValues(Vertices[i], 
					Vertices[i+1],
					Vertices[i+2]);
		verts.push(xyzComp);	
	}
	
	this.color = [];
	this.vertices = verts ;
	this.indexes = Indexes ;
	this.objColor = Color ;
}

SORObject.prototype.calculateVNormals = function(){	
		
	var len = this.vertices.length;
	this.normals = [];	
	for(var i = 0 ; i < len ; i += 4){	
		if(i+4 == len){
			var normal1 = pointsToNormals(this.vertices[3], this.vertices[i], this.vertices[i+1]);
			var normal2 = pointsToNormals(this.vertices[i], this.vertices[i+1], this.vertices[2]);
			var normal3 = pointsToNormals(this.vertices[i+1], this.vertices[2], this.vertices[3]);
			var normal4 = pointsToNormals(this.vertices[i+2], this.vertices[i+3], this.vertices[i]);		
			this.normals.push(normal1, normal2, normal3, normal4);
		}	
		else{		
			var normal1 = pointsToNormals(this.vertices[i+3], this.vertices[i], this.vertices[i+1]);
			var normal2 = pointsToNormals(this.vertices[i], this.vertices[i+1], this.vertices[i+2]);
			var normal3 = pointsToNormals(this.vertices[i+1], this.vertices[i+2], this.vertices[i+3]);
			var normal4 = pointsToNormals(this.vertices[i+2], this.vertices[i+3], this.vertices[i]);
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
		this.color.push(faceColor[0], faceColor[1], faceColor[2]);
	}
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER);
	var vlen = this.vertices.length;
	var ver = [];
	for(var i = 0; i < vlen; i ++){
		ver.push(this.vertices[i].x, this.vertices[i].y, this.vertices[i].z);
	}
	var n = drawSOR(gl, ver, this.indexes, this.color);
	// Clear color and depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);	

	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}
