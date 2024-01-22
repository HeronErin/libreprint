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





var line_p1_e;
var line_p2_e;

var line_preview;
var line_sel_p;
var editLine;
var lineSettings;
function lineInit(){
    document.querySelector("#sidebarCont").classList.remove("active");
    
	editLine = [undefined, undefined, undefined, undefined];
	line_p1_e = line_p2_e = undefined;

	lineSettings= sideBar({
		title: "Line Tool",
		inputs: [
			{key: "x1", type: "unitbox", label: "X1: ", value: null},
			{key: "y1", type: "unitbox", label: "Y1: ", value: null},
			{key: "x2", type: "unitbox", label: "X2: ", value: null},
			{key: "y2", type: "unitbox", label: "Y2: ", value: null},
			{key: "length", type: "unitbox", label: "Length: ", onchange: lineSideBarSmartPoint, value: null},
			{key: "width", type: "unitbox", label: "Width: ", value:1/12},
			{key: "angle", type: "number", label: "Angle: ", onchange: lineSideBarSmartPoint, value: null},
			{key: "spoints", type: "checkbox", label: "Show points: ", value: true},
		]
	});

	line_sel_p = document.createElementNS("http://www.w3.org/2000/svg", "rect");

	document.querySelector("#board").appendChild(line_sel_p);
}
function lineSideBarSmartPoint(e){
	if (lineSettings.x1() === null && lineSettings.y1() === null ) return;
	if (lineSettings.length() === null || document.getElementById(lineSettings.angle).value === "") return;

	var lengthInPixels = lineSettings.length() * svgRatio;

	var [offx, offy] = rotate2d(lengthInPixels, 0, degToRad(document.getElementById(lineSettings.angle).value*1));

	if (line_p2_e===undefined) {
		line_p2_e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		line_p2_e.style.stroke="red";
		document.querySelector("#board").appendChild(line_p2_e);
	}
	editLine[2] = editLine[0] + offx;
	editLine[3] = editLine[1] + offy;
	line_preview.setAttribute("x2", editLine[2]);
	line_preview.setAttribute("y2", editLine[3]);
	var [ftx, fty] = svgToFt(editLine[2], editLine[3]);
	lineSettings.x2(ftx);
	lineSettings.y2(fty);

	lineTooChangeZoom();
}
function dumbPointUpdateSmartPoint(){
	if (lineSettings.x1() !== null && lineSettings.y1() !== null){
		if (line_p1_e === undefined){
			line_p1_e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			line_p1_e.style.stroke="black";
			document.querySelector("#board").appendChild(line_p1_e);
		}
		[editLine[0], editLine[1]] = ftToSvg(lineSettings.x1(), lineSettings.y1());
		lineTooChangeZoom();
	}else [editLine[0], editLine[1]] = [undefined, undefined];

	if (lineSettings.x2() !== null && lineSettings.y2() !== null){
		if (line_p2_e === undefined){
			line_p2_e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			line_p2_e.style.stroke="red";
			document.querySelector("#board").appendChild(line_p1_e);
		}
		[editLine[2], editLine[3]] = ftToSvg(lineSettings.x2(), lineSettings.y2());
		lineTooChangeZoom();
	}else [editLine[2], editLine[3]] = [undefined, undefined];

	var fullLine = !(editLine[0] === undefined || editLine[1] === undefined || editLine[3] === undefined || editLine[4] === undefined);
	
	if (fullLine && !line_preview){
		line_preview = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line_preview.setAttribute("style", "stroke:rgb(255,0,0);stroke-width:2")
		document.querySelector("#board").appendChild(line_preview);
	}
	if (!fullLine && line_preview){
		line_preview.remove();
		line_preview = undefined;
		fullLine=false;
	}
	if ((editLine[0] === undefined || editLine[1] === undefined) && line_p1_e){
		line_p1_e.remove();
		line_p1_e=undefined;
	}
	if ((editLine[2] === undefined || editLine[3] === undefined) && line_p2_e){
		line_p2_e.remove();
		line_p2_e=undefined;
	}

	if (fullLine){
		var distanceOnSvg = distance(editLine[0], editLine[1], editLine[2], editLine[3]);
		
		lineSettings.length(distanceOnSvg / svgRatio);

		var angle = radToDeg(getAngle(editLine[0], editLine[1], editLine[2], editLine[3]));
		
		document.getElementById(lineSettings.angle).value = angle;

		var [x2, y2] = ftToSvg(lineSettings.x2(), lineSettings.y2());
		editLine[3] = x2;
		editLine[4] = y3;
	}



}

function lineTooDestroy(){
	if (line_p1_e) line_p1_e.remove();
	if (line_p2_e) line_p2_e.remove();
	if (line_sel_p) line_sel_p.remove();
	if (line_preview) line_preview.remove();
	line_p1_e=line_p2_e=line_sel_p=line_preview=undefined;

}

function lineClick(xy){
	if (line_p1_e === undefined){
		var [ftx, fty] = svgToFt(xy[0], xy[1]);
		lineSettings.x1(ftx);
		lineSettings.y1(fty);
		dumbPointUpdateSmartPoint();
	}
	else if (line_p1_e && line_p2_e === undefined){
		line_p2_e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		line_p2_e.style.stroke="red";
		editLine[2] = xy[0];
		editLine[3] = xy[1];
		lineTooChangeZoom();
		document.querySelector("#board").appendChild(line_p2_e);

		var [ftx, fty] = svgToFt(xy[0], xy[1]);
		lineSettings.x2(ftx);
		lineSettings.y2(fty);
		dumbPointUpdateSmartPoint();
	}
}
var lastLineMouse = [-1, -1];
function lineToolMove(xy){
	lastLineMouse=xy;
	if (line_sel_p !== undefined){
		_magic_point(line_sel_p, xy[0], xy[1]);
	}
	if (line_p1_e !== undefined && line_p2_e === undefined){

		dumbPointUpdateSmartPoint();
	}
}
function _magic_point(obj, x, y){
	var screenPt = boardToScreen(x, y);
	screenPt[0]+=screen.width/80;
	screenPt[1]+=screen.width/80;
	var delta = screenToBoard(screenPt[0], screenPt[1]);
	delta[0] -= x;
	delta[1] -= y;
	delta[0] = Math.abs(delta[0]);
	delta[1] = Math.abs(delta[1]);

	obj.style.fill="none";
	obj.style.strokeWidth=delta[0]/32;

	obj.setAttribute("width", delta[0]);
	obj.setAttribute("height", delta[1]);
	obj.setAttribute("x", x - delta[0]/2);
	obj.setAttribute("y", y - delta[1]/2);
}
function lineTooChangeZoom(){
	
	if (editLine[0] !=undefined && editLine[1] !=undefined){
		if (line_p1_e == undefined){
			line_p1_e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			line_p1_e.style.stroke="black";
			document.querySelector("#board").appendChild(line_p1_e);
		}

		_magic_point(line_p1_e, editLine[0], editLine[1]);
	}else if (line_p1_e != undefined){
		line_p1_e.remove();
		line_p1_e=undefined;
	}

	if (editLine[3] !=undefined && editLine[4] !=undefined){
		if (line_p2_e == undefined){
			line_p2_e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			line_p2_e.style.stroke="red";
			document.querySelector("#board").appendChild(line_p2_e);
		}
		_magic_point(line_p2_e, editLine[2], editLine[3]);
	}else if (line_p2_e != undefined){
		line_p2_e.remove();
		line_p2_e=undefined;
	}


	if (line_sel_p != undefined){
		_magic_point(line_sel_p, lastLineMouse[0], lastLineMouse[1]);
	}
	
	if (editLine[0] !=undefined && editLine[1] !=undefined && editLine[3] !=undefined && editLine[4] !=undefined){
		if (line_preview == undefined){
			line_preview = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line_preview.setAttribute("style", "stroke:rgb(255,0,0);stroke-width:2")
			document.querySelector("#board").appendChild(line_preview);
		}
		line_preview.setAttribute("x1", editLine[0]);
		line_preview.setAttribute("y1", editLine[1]);
		line_preview.setAttribute("x2", editLine[2]);
		line_preview.setAttribute("y2", editLine[3]);
	}else if(line_preview != undefined){
		line_preview.remove();
		line_preview=undefined;
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


