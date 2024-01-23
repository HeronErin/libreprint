var currentlySelectedElement = null;

function selectToolInit(){
	currentlySelectedElement = null;
	handleSelectionToolSelection();
}



function handleSelectionToolSelection(){
	if (currentlySelectedElement == null){
		return selectToolWindowSel();
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
	for (let obj of map){
		if (obj.type == "line"){
			console.log("line")
		}
	}
}