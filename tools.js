// This file is part of LibrePrint, a free blueprint making website
// Copyright (C) 2024 - HeronErin

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.


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
	selectToolClick,
	lineClick,
	function(){}
]
let toolInits = [
	selectToolInit,
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


