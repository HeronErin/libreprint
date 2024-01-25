var currentlySelectedElement = null;

function selectToolInit(){
	currentlySelectedElement = null;
	handleSelectionToolSelection();
}



function handleSelectionToolSelection(){
	if (currentlySelectedElement == null){
		return selectToolWindowSel();
	}
	var sel = map[currentlySelectedElement];
	if (sel.type == "line"){
		activeToolbarItem=1;
		lineInit(currentlySelectedElement);
		updateActiveTool();

		linestate.isedit = currentlySelectedElement;
		editLine = sel.points;
		pointOneChange(sel.points[0]*svgRatio, sel.points[1]*svgRatio);
		pointTwoChange(sel.points[2]*svgRatio, sel.points[3]*svgRatio);
		lineSettings.width(sel.stroke);

		line_preview.remove();
		line_preview = svgElements[currentlySelectedElement];

		lineUpdateWidth();
		
		document.getElementById(lineSettings.color).value = sel.color;
		document.getElementById(lineSettings.color).oninput();



	}
}

function selectToolWindowSel(){
	let windowSettings;
	function liveSvgUpdate(){
		console.log(windowSettings);
        map[0].width=svgWidth=document.getElementById(windowSettings.width).value*1 || 0;
        map[0].height=svgHeight=document.getElementById(windowSettings.height).value*1 || 0;
        map[0].svgRatio=svgRatio=document.getElementById(windowSettings.svgRatio).value*1 || 0;

        map[0].svgOffsetX=svgOffsetX = windowSettings.offx()*1/svgRatio || 0;
        map[0].svgOffsetY=svgOffsetY = windowSettings.offy()*1/svgRatio || 0;
        map[0].showScreenBox=showScreenBox=windowSettings.showScreenBox();

        savebtn();
        initHtml(true);
	}
	windowSettings = sideBar({
		title: "Canvas Settings:",
		inputs: [
            {key: "width", type: "number", min: 10, label: "Svg width", value: svgWidth, onchange: liveSvgUpdate},
            {key: "height", type: "number", min: 10, label: "Svg height", value: svgHeight, onchange: liveSvgUpdate},
            {key: "offx", type: "unitbox", label: "Svg offset x", value: svgOffsetX*svgRatio, onchange: liveSvgUpdate},
            {key: "offy", type: "unitbox", label: "Svg offset y", value: svgOffsetY*svgRatio, onchange: liveSvgUpdate},
            {key: "svgRatio", type: "number", min: 0, label: "Pixels per foot", value: svgRatio, onchange: liveSvgUpdate},
            {key: "showScreenBox", type:"checkbox", value: showScreenBox, label: "Show image box", onchange: liveSvgUpdate}
        ]
	});
}

function selectToolClick(xy){
	var closestDistance;
	var closestIndex;
	for (let [index, obj] of map.entries()){
		if (obj.type == "line"){
			var distance = distanceToLine(xy[0]/svgRatio, xy[1]/svgRatio, obj.points[0], obj.points[1], obj.points[2], obj.points[3]);
			
			if (closestDistance != undefined && closestDistance < distance) continue;
			
			closestIndex = index;
			closestDistance = distance;
		}
	}
	if (closestDistance !== undefined){
		currentlySelectedElement = closestIndex;
		handleSelectionToolSelection();
	}
}