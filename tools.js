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

    var screenPoint = svgPoint.matrixTransform(svg.getScreenCTM());

    return [screenPoint.x, screenPoint.y]
}
document.getElementById('board').onclick = function(event) {
        var xy = screenToBoard(event.clientX, event.clientY);
        toolClickMng[activeToolbarItem](xy);
}
document.getElementById('board').onmousemove = function(event) {
        var xy = screenToBoard(event.clientX, event.clientY);
        toolMouseMng[activeToolbarItem](xy);
}



function distanceToLine(x, y, x2, y2, x3, y3) {
    const A = y3 - y2;
    const B = x2 - x3;
    const C = (x3 - x2) * y2 + (y2 - y3) * x2;

    // Calculate distance using the formula
    return Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
}

var line_p1_e;
var line_p2_e;
var editLine;
var lineSettings;
function lineInit(){
    document.querySelector("#sidebarCont").classList.remove("active");
    
	editLine = [undefined, undefined, undefined, undefined];
	line_p1_e = line_p2_e = undefined;

	lineSettings= sideBar({
		title: "Line Tool",
		inputs: [
			{key: "x1", type: "unitbox", label: "X1: "},
			{key: "y1", type: "unitbox", label: "Y1: "},
			{key: "x2", type: "unitbox", label: "X2: "},
			{key: "y2", type: "unitbox", label: "Y2: "},
			{key: "length", type: "unitbox", label: "Length: "},
			{key: "angle", type: "number", label: "Angle: "},
			{key: "spoints", type: "checkbox", label: "Show points: ", value: true},
		]
	});
}
function lineTooDestroy(){

}
function lineClick(xy){
	console.log(xy)
	if (line_p1_e == undefined){
		line_p1_e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		editLine[0] = xy[0];
		editLine[1] = xy[1];
		line_p1_e.setAttribute("style", "fill: none; stroke-width:1;stroke:rgb(0,0,0)");
		lineTooChangeZoom();
		document.querySelector("#board").appendChild(line_p1_e);
		console.log(line_p1_e);
	}
}
function lineToolMove(xy){

}
function lineTooChangeZoom(){
	console.log("zoom")
	if (line_p1_e != undefined){
		line_p1_e.setAttribute("width", zoomWidth/50);
		line_p1_e.setAttribute("height", zoomHeight/50);
		line_p1_e.setAttribute("x", editLine[0] - zoomWidth/50/2);
		line_p1_e.setAttribute("y", editLine[1] - zoomHeight/50/2);
	}
}




let toolMouseMng = [
	function(){},
	lineToolMove,
	function(){}
]
let toolClickMng = [
	function(){},
	lineClick,
	function(){}
]
let toolInits = [
	function(){},
	lineInit,
	function(){}
]

let toolClosers = [
	function(){},
	lineTooDestroy,
	function(){}
]

let toolZoomHandle = [
	function(){},
	lineTooChangeZoom,
	function(){}
]


