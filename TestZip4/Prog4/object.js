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

	this.objectId = Color[3]*255;

	this.modelMatrix = [new Matrix4(), new Matrix4()];   // Model view projection matrix


	this.objColor = Color.slice(0) ; //Assigned color of object!

	this.color = []; // Generated color, with normals, and lighting

	this.vertices = verts;

	this.indexes = Indexes;

	this.ver;

	this.translation = new xyzValues(0, 0, -1);
    this.projTranslation = new xyzValues(0, 0, -1);


	this.rotationX =1 ;
    this.rotationZ =1 ;
    this.angle = 0;

    this.scaleFactor = 1;
	this.oScaleFactor = 1;
	this.scaling = new xyzValues(1,1,1);

    this.calculateVNormals();
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

}

SORObject.prototype.renderColor = function(bool){

    this.bool = bool;
	var clen = this.normals.length


	for(var k = 0; k < clen; k ++){
		var faceColor = colorPoly(this.objColor, [1.0, 1.0, 1.0] , this.normals[k], [1.0, 1.0, 1.0]);
		this.color.push(faceColor[0], faceColor[1], faceColor[2], (this.objectId/255));
	}
	this.grey = [];

	for(var i = 0 ; i < this.normals.length; i ++){
		var faceColor = colorPoly([0.5, 0.5, 0.5], [1.0, 1.0, 1.0] , this.normals[i], [1.0, 1.0, 1.0]);
		this.grey.push(faceColor[0], faceColor[1], faceColor[2], (this.objectId/255));

	}

	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER);
	var vlen = this.vertices.length;
	var ver = [];
	for(var i = 0; i < vlen; i ++){
		ver.push(this.vertices[i].x, this.vertices[i].y, this.vertices[i].z);
	}
	this.ver = ver.slice(0) ;

    if(orthoproj){
        var modelMatrix = new Matrix4(); // Model matrix
        var scaleMatrix = new Matrix4();
        scaleMatrix.setScale(this.oScaleFactor, this.oScaleFactor, this.oScaleFactor);
        modelMatrix.setTranslate(this.translation.x -ortPangX, this.translation.y-ortPangY, -1);
        this.modelMatrix[0].set(modelMatrix).multiply(scaleMatrix);

        if(!bool){

            var n = drawSOR(gl, this.ver, this.indexes, this.color);
        }

        else{

            var n = drawSOR(gl, this.ver, this.indexes, this.grey);

        }
        gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.modelMatrix[0].elements);
    }
    else if(!orthoproj){
        var modelMatrix = new Matrix4(); // Model matrix
        var viewMatrix = new Matrix4();  // View matrix
        var projMatrix = new Matrix4();  // Projection matrix
        var scaleMatrix = new Matrix4();
        var rotationMatrix = new Matrix4();
        // Calculate the model, view and projection matrices
        rotationMatrix.setRotate(this.angle, this.rotationX, 0, this.rotationZ);

        scaleMatrix.setScale(this.scaling.x, this.scaling.y, this.scaling.z);
        modelMatrix.setTranslate(this.projTranslation.x, this.projTranslation.y, inNOut);
        viewMatrix.setLookAt(PangX, PangY, 4.5, 0, 0, -50, 0, 1, 3);
        projMatrix.setPerspective(defFOV, canvas.width/canvas.height, 1, 100);

        // Calculate the model view projection matrix
        this.modelMatrix[1].set(projMatrix).multiply(viewMatrix).multiply(modelMatrix).multiply(scaleMatrix).multiply(rotationMatrix);
        // Pass the model view projection matrix to u_MvpMatrix
        gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.modelMatrix[1].elements);
        if(!bool) {
            var n = drawSOR(gl, this.ver, this.indexes, this.color);
        }
        else{
            var n = drawSOR(gl, this.ver, this.indexes, this.grey);
        }
        //gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.modelMatrix[1].elements);
    }

	// Clear color and depth buffer
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);

	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

}

SORObject.prototype.transformObject = function(deltaX, deltaY) {
    var deltVals;
    if(orthoproj && !rightClickIsDown) {
        if ((deltaX && deltaY) == null) {
            deltVals = [0, 0];
        } else {
            deltVals = getDeltaValues(this.translation.x, this.translation.y, deltaX, deltaY);
        }
        this.translation.x += deltVals[0];
        this.translation.y += deltVals[1];
    }
    else if(!orthoproj && !rightClickIsDown){
        console.log("tran proj obj")
        if ((deltaX && deltaY) == null) {
            deltVals = [0, 0];
        } else {
            deltVals = getDeltaValues(this.projTranslation.x, this.projTranslation.y, deltaX, deltaY);
        }
        this.projTranslation.x += deltVals[0];
        this.projTranslation.y += deltVals[1];
    }
    else if(rightClickIsDown){
    //     //console.log(this.rotationX, this.rotationZ);
    //     console.log(deltaX*2, deltaY*2);
        if(this.angle ==0){
            this.rotationX =0;
            this.rotationZ =0;
        }
        var deltV = getDeltaValues(this.rotationX, this.rotationZ, deltaX, deltaY);
    //     console.log(this.angle);
        console.log(deltV);
        this.rotationX += deltV[0];
        this.rotationZ += deltV[1];

        if(this.rotationX < 0){
            this.rotationX = 0;
        }
        else if(this.rotationX > 1){
            this.rotationX =1;
        }
        if(this.rotationZ < 0){
            this.rotationZ = 0;
        }
        else if(this.rotationZ>1){
            this.rotationZ =1;
        }

    }
}
