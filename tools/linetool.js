var sideBar;
var line_p1_e;
var line_p2_e;
var line_sel_p;

var is_p2_canonical = false;
var line_preview;
var editLine;
var lineSettings;
var linestate;
function lineInit(){
    document.querySelector("#sidebarCont").classList.remove("active");
    
	editLine = [undefined, undefined, undefined, undefined];
	line_p1_e = line_p2_e = undefined;
	linestate = {state: "dot 1 seeking"}



	lineSettings= sideBar({
		title: "Line Tool",
		inputs: [
			{key: "x1", type: "unitbox", label: "X1: ", value: null, onchange: pointOneChange},
			{key: "y1", type: "unitbox", label: "Y1: ", value: null, onchange: pointOneChange},
			{key: "x2", type: "unitbox", label: "X2: ", value: null, onchange: pointTwoChange},
			{key: "y2", type: "unitbox", label: "Y2: ", value: null, onchange: pointTwoChange},
			{key: "angle", type: "number", label: "Angle: ", value: null, onchange:smartAngle},
			{key: "length", type: "unitbox", label: "Length: ", value: null, onchange:smartAngle},
			{key: "width", type: "unitbox", label: "Width: ", value:1/12, onchange: lineUpdateWidth},
			{key: "color", type:"text", label: "Color:", value: "black", onchange: function(){
				if (line_preview) line_preview.style.stroke = document.getElementById(lineSettings.color).value;
			}},
			{type: "buttongroup", buttons: [
				{label:"Reset", class: "backbtn", onclick: function(){
					lineToolDestroy();
					lineInit();
				}},
				{label:"Add to screen", class: "savebtn", onclick: function(){
					if (lineSettings.x1() == null || lineSettings.y1() == null || lineSettings.x2() == null || lineSettings.y2() == null)
						return;
					map.push({
						"type": "line",
						"points": [lineSettings.x1(), lineSettings.y1(), lineSettings.x2(), lineSettings.y2()],
						"color": document.getElementById(lineSettings.color).value
					});
					savebtn();
					lineToolDestroy();
					lineInit();
					initHtml();
				}},
			]}
		]
	});

	line_sel_p = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	line_sel_p.style.stroke = "black";
	document.querySelector("#board").appendChild(line_sel_p);
}
function smartAngle(){
	let angle = document.getElementById(lineSettings.angle).value;
	let len = lineSettings.length();
	if (angle != "" && len != null){
		let [px, py] = rotate2d(len * svgRatio, 0, degToRad(angle*1));
		console.log([px, py])
		pointTwoChange(px+editLine[0], py+editLine[1]);
	}
}


function lineToolDestroy(){
	if (line_p1_e) line_p1_e.remove();
	if (line_p2_e) line_p2_e.remove();
	if (line_sel_p) line_sel_p.remove();
	if (line_preview) line_preview.remove();
	line_p1_e=line_p2_e=line_sel_p=line_preview=undefined;

}
function pointOneChange(xOrEvent, y, noZoomFunc){
	if (y==undefined){
		if (lineSettings.x1() != null && lineSettings.y1() != null){
			[xOrEvent, y] = ftToSvg(lineSettings.x1(), lineSettings.y1());
		}else {
			if (linestate.state == "dot 1 seeking") return;
			if (linestate.state == "points found") linestate.demoted=true;

			[editLine[0], editLine[1]] = [undefined, undefined];

			linestate.state = "dot 1 seeking";
			line_p1_e.remove();
			line_preview.remove();
			return;
		};
	}


	[editLine[0], editLine[1]] = [xOrEvent, y];
	if (editLine[2] != undefined && editLine[3] != undefined){
		let angle = getAngle(editLine[0], editLine[1], editLine[2], editLine[3]);
		lineSettings.length(distance(editLine[0], editLine[1], editLine[2], editLine[3]) / svgRatio);

		document.getElementById(lineSettings.angle).value = Math.round(radToDeg(angle));
	}

	if (linestate.state == "dot 1 seeking"){
		let handleDemotion = linestate.demoted && lineSettings.x2() != null && lineSettings.y2() != null;
		if (handleDemotion)
			linestate.state="points found";
		else
			linestate.state= "dot 2 search";
		var [ftx, fxy] = svgToFt(editLine[0], editLine[1]);


		lineSettings.x1(ftx);
		lineSettings.y1(fxy);



		line_p1_e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		line_p1_e.style.stroke="black";
		document.querySelector("#board").appendChild(line_p1_e);

		line_preview = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line_preview.style.stroke = document.getElementById(lineSettings.color).value;
		lineUpdateWidth();
		document.querySelector("#board").appendChild(line_preview);
	}
	if (noZoomFunc){
		line_preview.setAttribute("x1", editLine[0]);
		line_preview.setAttribute("y1", editLine[1]);
		line_preview.setAttribute("x2", editLine[2]);
		line_preview.setAttribute("y2", editLine[3]);
	}
	if (noZoomFunc == undefined)
	lineToolChangeZoom();	
}
function lineUpdateWidth(){
	if (line_preview) line_preview.style.strokeWidth= (lineSettings.width()||1/12) * svgRatio;
}
function pointTwoChange(xOrEvent, y, noZoomFunc){
	if (y == undefined){
		if (lineSettings.x2() != null && lineSettings.y2() != null){
			[xOrEvent, y] = ftToSvg(lineSettings.x2(), lineSettings.y2());
		}else {
			if (linestate.state == "dot 1 seeking") return;
			if (linestate.state == "dot 2 seeking") return;
			[editLine[2], editLine[3]] = [undefined, undefined];
			linestate.state = "dot 2 seeking";
			line_p2_e.remove();
			
			return;
		};
	}

	line_sel_p.remove();

	[editLine[2], editLine[3]] = [xOrEvent, y];
	linestate.state="points found";

	var [ftx, fxy] = svgToFt(editLine[2], editLine[3]);

	lineSettings.x2(ftx);
	lineSettings.y2(fxy);


	let angle = getAngle(editLine[0], editLine[1], editLine[2], editLine[3]);
	lineSettings.length(distance(editLine[0], editLine[1], editLine[2], editLine[3]) / svgRatio);

	document.getElementById(lineSettings.angle).value = Math.round(radToDeg(angle));





	if (line_p2_e == undefined){
		line_p2_e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		line_p2_e.style.stroke="red";
		document.querySelector("#board").appendChild(line_p2_e);
	}
	if (noZoomFunc){
		line_preview.setAttribute("x1", editLine[0]);
		line_preview.setAttribute("y1", editLine[1]);
		line_preview.setAttribute("x2", editLine[2]);
		line_preview.setAttribute("y2", editLine[3]);
	}

	if (noZoomFunc == undefined)
	lineToolChangeZoom();


}
function lineClick(xy){
	if (linestate.state == "dot 1 seeking"){
		pointOneChange(xy[0], xy[1])
	}
	else if (linestate.state == "dot 2 search"){
		pointTwoChange(xy[0], xy[1])
	}
	else if (linestate.state == "points found" && !linestate.moving){
		
		let p1 = _magic_point(line_p1_e, editLine[0], editLine[1]);
		let p2 = _magic_point(line_p2_e, editLine[2], editLine[3]);
		
		let inp1 =isInBox(xy[0], xy[1], p1[0], p1[1], p1[2], p1[3]);
		let inp2 =isInBox(xy[0], xy[1], p2[0], p2[1], p2[2], p2[3]);
		
		if (!(inp1 || inp2)) return; 
		

		linestate.moving = inp1 ? "p1" : "p2";
		
		lineToolMouseMove(xy);
	}else if (linestate.state == "points found" && linestate.moving){
		linestate.moving = undefined;
	}
}
var lastLineMouse = [-1, -1];
function lineToolMouseMove(xy){
	lastLineMouse=xy;
	if (line_sel_p !== undefined && linestate.state == "dot 1 seeking" || linestate.state == "dot 2 search"){
		_magic_point(line_sel_p, xy[0], xy[1]);
	}
	if (linestate.state == "dot 2 search"){
		line_preview.setAttribute("x1", editLine[0]);
		line_preview.setAttribute("y1", editLine[1]);
		line_preview.setAttribute("x2", xy[0]);
		line_preview.setAttribute("y2", xy[1]);
	}
	if (linestate.state == "points found" && linestate.moving){
		let offset = linestate.moving=="p1" ? 0 : 2;
		let obj = linestate.moving=="p1" ? line_p1_e : line_p2_e;
		[editLine[offset], editLine[offset+1]] = xy;

		let [ftx, fty] = svgToFt(xy[0], xy[1]);

		_magic_point(obj, editLine[offset], editLine[offset+1]);

		(linestate.moving=="p1" ? lineSettings.x1 : lineSettings.x2)(ftx);
		(linestate.moving=="p1" ? lineSettings.y1 : lineSettings.y2)(fty);

		(linestate.moving=="p1" ? pointOneChange : pointTwoChange)(xy[0], xy[1], true);
	}
}
function _magic_point(obj, x, y){
	let screenPt = boardToScreen(x, y);
	screenPt[0]+=screen.width/80;
	screenPt[1]+=screen.width/80;
	let delta = screenToBoard(screenPt[0], screenPt[1]);
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
	return [x - delta[0]/2, y - delta[1]/2, x + delta[0], y + delta[1]]
}
function lineToolChangeZoom(){
	if (line_p1_e != undefined){
		_magic_point(line_p1_e, editLine[0], editLine[1]);
	}
	if (line_p2_e != undefined){
		_magic_point(line_p2_e, editLine[2], editLine[3]);
	}
	if (line_sel_p != undefined){
		_magic_point(line_sel_p, lastLineMouse[0], lastLineMouse[1]);
	}

	if (linestate.state=="points found"){


		line_preview.setAttribute("x1", editLine[0]);
		line_preview.setAttribute("y1", editLine[1]);
		line_preview.setAttribute("x2", editLine[2]);
		line_preview.setAttribute("y2", editLine[3]);
	}


	// Simulate mouse move
	
	lineToolMouseMove(lastLineMouse);
	
}
