for (let [index, tool] of document.querySelectorAll(".navtool").entries()){
	tool.onclick = function(){
		if (activeToolbarItem != index){
			toolClosers[activeToolbarItem]();
			activeToolbarItem=index;
			toolInits[index]();
			updateActiveTool();
		}
	}
}

function updateActiveTool(){
	for (let tool of document.querySelectorAll(".navtool")){
		tool.classList.remove("active");
	}
	document.querySelectorAll(".navtool")[activeToolbarItem].classList.add("active");
}
function screenToBoard(x, y){
	var svg = document.getElementById('board');
    var point = svg.createSVGPoint();

    point.x = x;
    point.y = y;

    var svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

    return [svgPoint.x, svgPoint.y]
}
function boardToScreen(x, y){
	var svg = document.getElementById('board');
    var point = svg.createSVGPoint();

    point.x = x;
    point.y = y;

    var screenPoint = point.matrixTransform(svg.getScreenCTM());
    return [screenPoint.x, screenPoint.y]
}
function svgToFt(x, y){
	return [
		x / svgRatio,
		y / svgRatio
	];
}
function ftToSvg(x, y){
	return [
		x * svgRatio,
		y * svgRatio,
	];
}
function distanceToLine(x, y, x2, y2, x3, y3) {
    const A = y3 - y2;
    const B = x2 - x3;
    const C = (x3 - x2) * y2 + (y2 - y3) * x2;

    // Calculate distance using the formula
    return Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
}
function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) +  Math.pow(y2 - y1, 2))
}
function fixDeg(angle){
	while (angle < 0) angle +=360;
	while (angle > 360) angle -=360;
	return angle;
}
function getAngle(x1, y1, x2, y2){
	return Math.atan2(y2 - y1, x2 - x1);
}
function rotate2d(x, y, angle){
	return [
		x * Math.cos(angle) - y * Math.sin(angle),
		y * Math.cos(angle) + x * Math.sin(angle)
	];
}
function isInBox(x, y, x2, y2, x3, y3) {
    return  x >= x2 && y >= y2 && x <= x3 && y <= y3;
}


function degToRad(deg){
	return deg * (Math.PI/180);
}
function radToDeg(rad){
	return fixDeg(rad * (180/Math.PI));
}

document.getElementById('board').onclick = function(event) {
        var xy = screenToBoard(event.clientX, event.clientY);
        toolClickMng[activeToolbarItem](xy);
}
document.getElementById('board').onmousemove = function(event) {
        var xy = screenToBoard(event.clientX, event.clientY);
        toolMouseMng[activeToolbarItem](xy);
}









let toolMouseMng = [
	function(){},
	lineToolMouseMove,
	function(){}
]
let toolClickMng = [
	function(){},
	lineClick,
	function(){}
]
let toolInits = [
	function(){console.log("tool init")},
	lineInit,
	function(){}
]

let toolClosers = [
	function(){},
	lineToolDestroy,
	function(){}
]

let toolZoomHandle = [
	function(){},
	lineToolChangeZoom,
	function(){}
]


