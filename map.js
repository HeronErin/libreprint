function overideKeys (event){
    if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189'  ) ) {
        var isUp = event.which == '107' || event.which == '61'|| event.which=="187";
        if (!hasModal){
            if(!isUp) {zoomWidth*=1.1;zoomHeight*=1.1}
            else {zoomWidth*=0.9;zoomHeight*=0.9}

            updateSvgZoom();
        }
        event.preventDefault();
        // 107 Num Key  +
        //109 Num Key  -
        //173 Min Key  hyphen/underscor Hey
        // 61 Plus key  +/=
     }
     if (!hasModal){
        if (event.key == "ArrowDown") zoomY+=zoomHeight*0.07;
        if (event.key == "ArrowUp") zoomY-=zoomHeight*0.07;
        if (event.key == "ArrowLeft") zoomX-=zoomWidth*0.07;
        if (event.key == "ArrowRight") zoomX+=zoomWidth*0.07;
        updateSvgZoom();
     }
}


function unitbox(props){
    let cont = document.createElement("div");
    let sel = document.createElement("select");
    sel.innerHTML = `
        <option value="ft/in">Ft/In</option>
        <option value="meter">Meter</option>
        <option value="m/cm">M/Cm</option>
    `;
    let unitArea = document.createElement("div");
    var current = sel.value;
    var inputs = {};
    function updateProp(){
        if (current == "ft/in"){
            if (inputs.ft.value === "" && inputs.in.value === "") props.value = null;
            else{
                props.value = inputs.ft.value*1;
                props.value += inputs.in.value*1/12;
            }
        }
        if (current == "meter"){
            props.value = inputs.meter.value === "" ? null : inputs.meter.value * 3.28084;
        }
        if (current == "m/cm"){
            if (inputs.meter.value === "" && inputs.cm.value === "") props.value = null;
            else{
                props.value = inputs.meter.value * 3.28084;
                props.value += inputs.cm.value * 3.28084/100;
            }
        }
    }
    function valueChangeHook(){
        updateProp();
        if (current == "ft/in"){
            if (inputs.in.value*1 == 12 && inputs.ft.value != ""){
                inputs.ft.value = inputs.ft.value*1 + 1;
                inputs.in.value = 0;
            }
            if (inputs.in.value*1 == -1 && inputs.ft.value != ""){
                inputs.ft.value = inputs.ft.value*1 - 1;
                inputs.in.value = 11;
            }
        }
         if (current == "m/cm"){
            if (inputs.cm.value*1 == 100 && inputs.meter.value != ""){
                inputs.meter.value = inputs.meter.value*1 + 1;
                inputs.cm.value = 0;
            }
            if (inputs.cm.value*1 == -1 && inputs.meter.value != ""){
                inputs.meter.value = inputs.meter.value*1 - 1;
                inputs.cm.value = 99;
            }
        }
        if (props.onchange) props.onchange(props.value);
    }
    sel.oninput = function(event){
        if (event != undefined){
            updateProp();
        }

        current = sel.value;
        unitArea.innerHTML = "";

        if (current == "ft/in"){
            inputs.ft = document.createElement("input")
            inputs.ft.setAttribute("placeholder", "ft");
            inputs.ft.setAttribute("type", "number");

            if (props.value !== null)
                inputs.ft.value = Math.floor(props.value*1);
            inputs.ft.onchange = valueChangeHook;
            unitArea.appendChild(inputs.ft)

            inputs.in = document.createElement("input")
            inputs.in.setAttribute("min", "-1");
            inputs.in.setAttribute("max", "12");
            inputs.in.setAttribute("type", "number");
            inputs.in.setAttribute("placeholder", "in");
            inputs.in.onchange = valueChangeHook;
            if (props.value !== null)
                inputs.in.value = Math.round(props.value*12)%12;
            unitArea.appendChild(inputs.in)
        }
        if (current == "meter"){
            inputs.meter = document.createElement("input")
            inputs.meter.setAttribute("type", "number");
            inputs.meter.setAttribute("placeholder", "Meters");
            inputs.meter.onchange = valueChangeHook;
            if (props.value !== null)
                inputs.meter.value = props.value*1/3.28084;
            unitArea.appendChild(inputs.meter)
        }
        if (current == "m/cm"){
            let meters = props.value*1/3.28084;
            inputs.meter = document.createElement("input")
            inputs.meter.setAttribute("type", "number");
            inputs.meter.setAttribute("placeholder", "Meters");
            inputs.meter.onchange = valueChangeHook;
            if (props.value !== null)
                inputs.meter.value = Math.floor(meters);
            unitArea.appendChild(inputs.meter)
            meters-=Math.floor(meters);

            inputs.cm = document.createElement("input")
            inputs.cm.setAttribute("min", "-1");
            inputs.cm.setAttribute("max", "100");
            inputs.cm.setAttribute("type", "number");
            inputs.cm.setAttribute("placeholder", "Centimeters");
            inputs.cm.onchange = valueChangeHook;
            if (props.value !== null)
                inputs.cm.value=Math.floor(meters*100)
            unitArea.appendChild(inputs.cm)
        }
    };



    cont.appendChild(sel);
    cont.appendChild(unitArea);

    props.addTo.appendChild(cont)
    sel.oninput();
    return function(forceValue){
        if (forceValue === undefined){
            updateProp();
            return props.value;
        }else{
            props.value = forceValue;
            sel.oninput();
            
        }
    };

}
var hasModal = false;
function modal(props){
    hasModal=props.isNotModal ? false : true
    
    
    if (props.activeElement !== null)
        document.querySelector(props.activeElement || "#modalBackdrop").classList.add("active")
    document.querySelector(props.titleElement || "#modalTitle").textContent = props.title || "";
    document.querySelector(props.inputElement || "#modalInputs").innerHTML = "";
    var open = true;
    var inputs = props.inputs || [];
    var i = 0;
    var ids = {}
    for (let input of inputs){
        var id = (props.idPrepend||`_model_input_`)+i;
        ids[input.key] = id;
        let tr = document.createElement("tr")

        let label = document.createElement("label");
        label.id = id+"_l";
        label.setAttribute("for", id);
        label.setAttribute("class", "modelLabel");
        label.textContent = input.label || " ";

        let th1 = document.createElement("th");
        th1.appendChild(label)
        tr.appendChild(th1);

        if (input.type == "button"){
            // let btn = document.createElement("button");
            // inputE.id = id;
            // inputE.setAttribute("class", input.class);
            // inputE.onclick = input.onclick;
        }
        else if (input.type != "unitbox"){
            let inputE = document.createElement("input");
            inputE.id = id;
            inputE.setAttribute("type", input.type);
            inputE.setAttribute("class", "modelInput");
            
            inputE.value = input.value || "";
            inputE.oninput=input.onchange;

            let th2 = document.createElement("th");
            th2.appendChild(inputE)
            tr.appendChild(th2);



            if (input.type == "number"){
                if (input.min != undefined) inputE.setAttribute("min", input.min);
                if (input.max != undefined) inputE.setAttribute("max", input.max);
            }
            if (input.type == "checkbox"){
                inputE.checked = input.value;
                ids[input.key] = function(){return inputE.checked;}
            }
        }else{
            ids[input.key] = unitbox({
                addTo: tr,
                value: input.value,
                onchange: input.onchange
            })
        }
        document.querySelector(props.inputElement || "#modalInputs").appendChild(tr)
        if (props.doBrs != undefined)
            for (let x=props.doBrs;x--;)
                document.querySelector(props.inputElement || "#modalInputs").appendChild(document.createElement("br"));
        i++;
    }
    if (props.savebtn != null)
        document.querySelector(props.savebtn || "#modalSave").onclick = function(){
            if (!open) return;
            open=false;
            for (let k of Object.keys(ids)){
                let v = ids[k];
                if (typeof(v) == "function") v = v();
                else v = document.querySelector("#"+v).value;
                ids[k] = v;
            }
            if (props.activeElement !== null)
                document.querySelector(props.activeElement||"#modalBackdrop").classList.remove("active");
            hasModal=false
            
            
            props.onSubmit(ids);
        }
    return ids;
}
document.querySelector("#modalBack").onclick = function(){
    hasModal=false;
    document.querySelector("#modalBackdrop").classList.remove("active")
};
document.querySelector("#settingsBtn").onclick = function(){
    modal({
        title: "Settings",
        inputs: [
            {key: "width", type: "number", min: 10, label: "Svg width", value: svgWidth},
            {key: "height", type: "number", min: 10, label: "Svg height", value: svgHeight},
            {key: "svgRatio", type: "number", min: 0, label: "Pixels per foot", value: svgRatio},
            {key: "showScreenBox", type:"checkbox", value: showScreenBox, label: "Show image box"}
        ],
        onSubmit: function(ret){
            console.log(ret)
            map[0].width=svgWidth=ret.width;
            map[0].height=svgHeight=ret.height;
            map[0].svgRatio=svgRatio=ret.svgRatio
            map[0].showScreenBox=showScreenBox=ret.showScreenBox
            savebtn();
        }
    })
};


function sideBar(props){
    return modal({
        activeElement: null,
        savebtn: null,
        isNotModal: true,
        idPrepend: "_sidebar_input_",
        titleElement: "#sideBarTitle",
        inputElement: "#sidebarInfo",
        title: props.title,
        inputs: props.inputs,


        doBrs: props.doBrs || 1
    });
}

function toggleSidebar(){
    let clist = document.querySelector("#sidebarCont").classList;
    if (clist.contains("active")) clist.remove("active");
    else clist.add("active");
}