var gl;
var a_Position;
var canvas;
var mvpMatrix ;
var orthoproj = true;;
var u_MvpMatrix;
var PangX = 0.0;
var PangY = 0.0;
var oldX = 0.0;
var oldY = 0.0;
var camlClick;
var inNOut= 0.0;
var inNOutBool;

var listOfObjects = [];

var createS;

var endRightClick; //boolean + end registering clicks
var points = []; //Stores points clicked
var clickedBG;
var defFOV;

var originalCoords = []; //Stores points clicked in (x,y,z) format

var masterYellow; // Boolean for yellow cube
var YCube;
var redOn; // Boolean for red line


var rotationMasterArray = []; //MAin Array that stores each vertex coordinates


var vertices = []; // Vertices Array
var indexes = []; // Indecies array
var colors = []; // Array for vertex colors


var flatNormal = []; // Array for face normals
var flatShader; // Flat Shader Boolean
var smoothShader = true; // Smooth Shader Boolean
var vertexNormal = []; // Array for normals in each vertex

