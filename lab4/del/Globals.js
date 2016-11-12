var gl;
var a_Position;

var mvpMatrix ;
var orthoproj;
var u_MvpMatrix;
var vertexBuffer;


var points = []; //Stores points clicked
var rightClick = [];//Stores right click
var coordinates = []; //Stores points clicked in (x,y,z) format
var yellowOn; // Boolean for yellow cube
var redOn; // Boolean for red line



var circles = [];
var rotationMasterArray = []; //MAin Array that stores each vertex coordinates

var vertices = []; // Vertices Array
var indexes = []; // Indecies array
var colors = []; // Array for vertex colors
var flatNormal = []; // Array for face normals
var flatShader; // Flat Shader Boolean
var smoothShader = true; // Smooth Shader Boolean
var vertexNormal = []; // Array for normals in each vertex

