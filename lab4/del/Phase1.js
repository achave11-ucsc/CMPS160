function lClick(ev){
	console.log("Left Click")
	console.log(ev);
}
function rClick(ev){
	ev.preventDefault(); 	
	console.log("Right Click");
	console.log(ev);
}
