//Commented Code OUT CODE

check(ev);
if(clickedBG == true && transformationDone == false && transformObjectXYZ == true ){
	transformationDone = true;
	transformObjectXYZ = false;
	clickedBG = false;
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

	listOfObjects[0].transformObject(x, y);
}

else if ((transformObjectXYZ == true) && (transformationDone == false)){
	var x = ev.clientX;
	var y = ev.clientY;

	var rect = ev.target.getBoundingClientRect() ; //Normalize canvas

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

	//transformationDone = true;

	listOfObjects[0].transformObject(x, y);
	listOfObjects[0].transX = 0;
	listOfObjects[0].transY = 0;

}
