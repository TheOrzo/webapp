const mobileMaxSize = 480; // size in px (= 30rem)
var config;
const animationTemplates = JSON.parse(`{"animations":[
                                       {"name":"none"},
                                       {"name":"static","options":[{"name":"color","type":"color"}],"defaults":{"color":0}},
                                       {"name":"transition","options":[{"name":"color 1","type":"color"},{"name":"color 2","type":"color"}],"defaults":{"color 1":0,"color 2":0}},
                                       {"name":"fade","options":[{"name":"delay[ms]","type":"int"},{"name":"color 1","type":"color"},{"name":"color 2","type":"color"}],"defaults":{"delay[ms]":"1000","color 1":0,"color 2":0}}]}`);


document.addEventListener("DOMContentLoaded", function(){
    requestConfig();    
});

window.addEventListener('popstate', function () {
    scrollToCurrentPanel();
});

window.addEventListener('load', function () {
    scrollToCurrentPanel();
    initButtonListeners();
});

function scrollToCurrentPanel() {
    if (window.location.hash == '') {
        this.location.href = "#scenes";
    }

    if (window.location.hash.startsWith("#scene-edit-")) {
        const editor = document.getElementById("lsd_scene_editor");
        editor.classList.remove("hidden");
        editor.classList.add("fadein");
        loadSceneEdit(window.location.hash.substring("#scene-edit-".length));
        return;
    } else {
        if (!document.getElementById("lsd_scene_editor").classList.contains("hidden")) {
            document.getElementById("lsd_scene_editor").classList.add("hidden");
        }
    }

    var pageOut = null;
    var pageIn = null;

    var panels = document.getElementsByClassName("content-scroller-child");
    for (let item of panels) {
        if (item.getAttribute("content") == window.location.hash.substring(1)) {
            pageIn = item;
        } else {
            if (!item.classList.contains("hidden")) {
                pageOut = item;
            }
        }
    }

    if (pageIn == null) {
        return;
    }
    if (pageIn == pageOut) {
        return;
    }

    scrollerItemRemoveAnimationClasses(pageIn);
    if (pageOut == null) {
        pageIn.classList.add("fadein");
    } else {
        scrollerItemRemoveAnimationClasses(pageOut);
        pageOut.classList.add("hidden");

        var navPosLast = document.getElementById(pageIn.getAttribute("content")).getBoundingClientRect();
        var navPostNew = document.getElementById(pageOut.getAttribute("content")).getBoundingClientRect();

        var scrollReadDir = navPosLast.x - navPostNew.x + navPosLast.y - navPostNew.y < 0;
        if (scrollReadDir) {
            pageIn.classList.add("scrollInReadDir")
            pageOut.classList.add("scrollOutReadDir")
        } else {
            pageIn.classList.add("scrollInAntiReadDir");
            pageOut.classList.add("scrollOutAntiReadDir");
        }

    }
}

function scrollerItemRemoveAnimationClasses(element) {
    element.removeAttribute("class");
    element.classList.add("content-scroller-child")
}

function requestConfig() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            config = JSON.parse(this.responseText);
            applyConfig();
        }
    };
    xhr.open("GET", "http://10.3.3.58/config", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.send();
}

function applyConfig() {
    loadHardwareConfig();
    loadSegmentConfig();
    loadScenes();
}

function initButtonListeners() {

}

function hdwBtnAddHandler() {
    const newTile = createHardware("New Output", -1, "");
    const spacer = document.getElementById('lsd_hardware_container').querySelector(".spacer");
    document.getElementById("lsd_hardware_container").insertBefore(newTile, spacer);
}

function createHardware(name, pin, count) {
    const item = document.createElement("form");
    item.classList.add("lsd-hardware-item");
    item.innerHTML = `
                <h2 contentEditable="true">${name}</h2>
                <div class="mdc-touch-target-wrapper">
                    <button class="mdc-button mdc-button--touch lsd-hardware-item-save">
                        <span class="mdc-button__ripple"></span>
                        <span class="mdc-button__touch"></span>
                        <span class="mdc-button__label">save</span>
                    </button>
                </div>
                <div class="mdc-touch-target-wrapper">
                    <button class="mdc-button mdc-button--touch lsd-hardware-item-delete">
                        <span class="mdc-button__ripple"></span>
                        <span class="mdc-button__touch"></span>
                        <i class="material-icons mdc-button__icon" aria-hidden="true">delete_outline</i>
                    </button>
                </div>
                <div class="mdc-select mdc-select--outlined">
                    <div class="mdc-select__anchor" aria-labelledby="outlined-select-label">
                        <span class="mdc-notched-outline">
                        <span class="mdc-notched-outline__leading"></span>
                        <span class="mdc-notched-outline__notch">
                            <span id="outlined-select-label" class="mdc-floating-label">Pick a GPIO Pin</span>
                        </span>
                        <span class="mdc-notched-outline__trailing"></span>
                        </span>
                        <span class="mdc-select__selected-text-container">
                        <span id="demo-selected-text" class="mdc-select__selected-text"></span>
                        </span>
                        <span class="mdc-select__dropdown-icon">
                        <svg
                            class="mdc-select__dropdown-icon-graphic"
                            viewBox="7 10 10 5" focusable="false">
                            <polygon
                                class="mdc-select__dropdown-icon-inactive"
                                stroke="none"
                                fill-rule="evenodd"
                                fill="white"
                                points="7 10 12 15 17 10">
                            </polygon>
                            <polygon
                                class="mdc-select__dropdown-icon-active"
                                stroke="none"
                                fill-rule="evenodd"
                                fill="white"
                                points="7 15 12 10 17 15">
                            </polygon>
                        </svg>
                        </span>
                    </div>
                    <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
                        <ul class="mdc-list">
                            <li class="mdc-list-item" data-value="1">
                                <span class="mdc-list-item__ripple"></span>
                                <span class="mdc-list-item__text">GPIO 1</span>
                            </li>
                            <li class="mdc-list-item" data-value="2">
                                <span class="mdc-list-item__ripple"></span>
                                <span class="mdc-list-item__text">GPIO 2</span>
                            </li>
                            <li class="mdc-list-item" data-value="3">
                                <span class="mdc-list-item__ripple"></span>
                                <span class="mdc-list-item__text">GPIO 3</span>
                            </li>
                            <li class="mdc-list-item" data-value="4">
                                <span class="mdc-list-item__ripple"></span>
                                <span class="mdc-list-item__text">GPIO 4</span>
                            </li>
                            <li class="mdc-list-item" data-value="5">
                                <span class="mdc-list-item__ripple"></span>
                                <span class="mdc-list-item__text">GPIO 5</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <label class="mdc-text-field mdc-text-field--outlined">
                    <span class="mdc-notched-outline">
                    <span class="mdc-notched-outline__leading"></span>
                    <span class="mdc-notched-outline__notch">
                        <span class="mdc-floating-label" id="hwd_leds_lable">Set amount of LEDs</span>
                    </span>
                    <span class="mdc-notched-outline__trailing"></span>
                    </span>
                    <input  type="number" min="0" step="1" value="${count}" class="mdc-text-field__input" aria-labelledby="hwd_leds_lable">
                </label>`;

    const list = item.querySelector(".mdc-list");
    for (let li of list.children) {
        if (li.getAttribute("data-value") == pin) {
            li.classList.add("mdc-list-item--selected");
        }
    }
    const select = mdc.select.MDCSelect.attachTo(item.querySelector(".mdc-select"));
    select.listen('MDCSelect:change', () => {
        item.getElementsByTagName('button')[0].style.visibility = "visible";
    });
    const pins = mdc.textField.MDCTextField.attachTo(item.querySelector(".mdc-text-field"));
    item.addEventListener('input', () => {
        item.getElementsByTagName('button')[0].style.visibility = "visible";
    });
    const button = mdc.ripple.MDCRipple.attachTo(item.querySelector(".mdc-button"));
    item.querySelector(".mdc-button").addEventListener('click', () => {
        sendConfig();
    });
    return item;
}

function loadHardwareConfig() {
    var container = document.getElementById("lsd_hardware_container");
    container.innerHTML = "";
    for (i = 0; i < config.hardware.length; i++) {
        const item = createHardware(config.hardware[i].name, config.hardware[i].pin, config.hardware[i].num);
        container.appendChild(item);
    }
    let spacer = document.createElement("div");
    spacer.classList.add("lsd-hardware-item");
    spacer.classList.add("spacer");
    container.appendChild(spacer.cloneNode());
    container.appendChild(spacer.cloneNode());
    container.appendChild(spacer);
}

function loadSegmentConfig() {

}

function loadScenes() {
    var container = document.getElementById("lsd_scene_container");
    container.innerHTML = "";
    for (i = 0; i < config.scenes.length; i++) {
        const item = document.createElement("div");
        item.classList.add("lsd-scene-item");
        item.id = ("scene" + i);
        item.style = "--color:" + config.scenes[i].panelColor;
        item.innerHTML = `
            <div class="lsd-scene-item-drag">
                <i class="material-icons">
                    drag_indicator
                </i>
            </div>
            <div class="lsd-scene-item-content">
                <a href="#scene-edit-${i}">${config.scenes[i].name}</a>
                <div class="lsd-scene-item-content-expanded">
                <div class="mdc-slider">
                <input class="mdc-slider__input" type="range" min="0" max="100" value="50" name="volume" aria-label="Continuous slider demo">
                <div class="mdc-slider__track">
                  <div class="mdc-slider__track--inactive"></div>
                  <div class="mdc-slider__track--active">
                    <div class="mdc-slider__track--active_fill"></div>
                  </div>
                </div>
                <div class="mdc-slider__thumb">
                  <div class="mdc-slider__thumb-knob"></div>
                </div>
              </div>
                </div>
            </div>
            <div class="lsd-scene-item-close">
                <button class="mdc-button" onclick="sceneActivateButtonClick(${i})">
                    <span class="mdc-button__label material-icons">power_settings_new</span>
                </button>
            </div>`;
        container.appendChild(item);
        mdc.slider.MDCSlider.attachTo(item.querySelector('.mdc-slider'));
    }
    let spacer = document.createElement("div");
    spacer.classList.add("lsd-scene-item");
    spacer.classList.add("spacer");
    container.appendChild(spacer.cloneNode());
    container.appendChild(spacer.cloneNode());
    container.appendChild(spacer);
}

function sceneActivateButtonClick(id) {
    document.getElementById("scene" + id).classList.toggle("expanded");
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// id: ID of Scene in synced config json
function loadSceneEdit(scene) {
    const scenes_container = document.getElementById("lsd_scene_editor");
    const selectSegmentElmt = scenes_container.querySelectorAll(".mdc-select")[0];
    const selectAnimationElmt = scenes_container.querySelectorAll(".mdc-select")[1];
    const segmentsList = document.getElementById("lsd_scene_editor_segment_list");
    const animationList = document.getElementById("lsd_scene_editor_animation_list");
    const editor = document.getElementById("lsd_scene_editor_options");
    const sceneNameField = document.getElementById("lsd-scene-editor-name");

    // reset
    segmentsList.innerHTML = "";
    animationList.innerHTML = "";
    editor.innerHTML = "";

    if (config.scenes[scene] == null) {
        // todo show error message
        return;
    }

    // build segments list
    id = 0;
    for (let li of config["segments"]) {
        const listItem = document.createElement('li');
        listItem.classList.add("mdc-list-item");
        listItem.setAttribute("data-value", id++);
        const listItemText = document.createElement('span');
        listItemText.classList.add("mdc-list-item__text");
        listItemText.textContent = li.name;
        listItem.appendChild(listItemText);
        segmentsList.appendChild(listItem);
    }

    // build animation list
    id = 0;
    animationId = 0;
    for (let li of animationTemplates.animations) {
        const listItem = document.createElement('li');
        listItem.classList.add("mdc-list-item");
        listItem.setAttribute("data-value", id++);
        const listItemText = document.createElement('span');
        listItemText.classList.add("mdc-list-item__text");
        listItemText.textContent = li.name;
        listItem.appendChild(listItemText);
        animationList.appendChild(listItem);
    }

    // initiate segment select menu
    selectSegmentElmt.classList.remove("hidden");
    const selectSegment = mdc.select.MDCSelect.attachTo(selectSegmentElmt);
    selectSegment.listen('MDCSelect:change', (event) => {
        sceneId = window.location.hash.substring("#scene-edit-".length);
        segmentIndex = findSceneSegmentIndex(sceneId, event.detail.value);
        if (segmentIndex == -1) {
            animationIndex = 0
        } else {
            animationIndex = config.scenes[sceneId].segments[segmentIndex].animation.id;
        }
        if (selectAnimation.selectedIndex == animationIndex) {
            //trigger update manually
            loadSceneEditOptions(sceneId, event.detail.value, animationIndex);
        } else {
            // selectAnimation will trigger update
            selectAnimation.selectedIndex = animationIndex
        }
    });

    // initiate animation select menu
    selectAnimationElmt.classList.remove("hidden");
    const selectAnimation = mdc.select.MDCSelect.attachTo(selectAnimationElmt);
    selectAnimation.listen('MDCSelect:change', (event) => {
        // todo es wird kein update getriggert falls zwei Segmente die gleiche Animation haben und die Select Box sich nicht ändert
        sceneId = window.location.hash.substring("#scene-edit-".length);
        loadSceneEditOptions(sceneId, selectSegment.selectedIndex, selectAnimation.selectedIndex);
    });

    // select first defined segment or index 0
    if (config.scenes[scene].segments[0].id != null) {
        selectSegment.selectedIndex = config.scenes[scene].segments[0].id;
        selectAnimation.selectedIndex = config.scenes[scene].segments[0].animation.id;
    } else {
        selectSegment.selectedIndex = 0;
        selectAnimation.selectedIndex = 0;
    }

    //load scene name
    sceneNameField.textContent = config.scenes[scene].name;
    if (animationId != 0) {
        loadSceneEditOptions(scene, selectSegment.selectedIndex, animationId);
    }
}

function loadSceneEditOptions(sceneId, segmentId, animationId) {
    console.log("animationId: " +  animationId);
    const editor = document.getElementById("lsd_scene_editor_options");
    // find where segment is located in scene's segment list
    segmentIndex = findSceneSegmentIndex(sceneId, segmentId);
    // clean options
    editor.innerHTML = "";
    if (animationId == 0) {
        config.scenes[sceneId].segments.splice(segmentIndex,segmentIndex+1);
        sceneId = window.location.hash.substring("#scene-edit-".length);
        sendScene(sceneId);
        return;
    }

    // if there is no a configuration for this segment => create one
    if (segmentIndex == -1) {
        segmentIndex = config.scenes[sceneId].segments.length;
        config.scenes[sceneId].segments[segmentIndex] = {id:segmentId,animation:{id:-1}};
    }

    // check if config options corresponds to selected animation
    if (config.scenes[sceneId].segments[segmentIndex].animation.id != animationId) {
        config.scenes[sceneId].segments[segmentIndex].animation = Object.assign({}, animationTemplates.animations[animationId].defaults);
        config.scenes[sceneId].segments[segmentIndex].animation.id = animationId;
    }

    animation = config.scenes[sceneId].segments[segmentIndex].animation;

    // build options
    for (let option of animationTemplates.animations[animationId].options) {
        const panel = document.createElement('div');
        panel.classList.add("lsd-scene-editor-options-panel");
        const attributePanel = document.createElement("div");
        attributePanel.classList.add("lsd-scene-editor-options-panel-attributes")
        panel.appendChild(attributePanel);
        editor.appendChild(panel);
        switch (option.type) {
            case "color":
                const label = document.createElement('span');
                label.innerText = option.name;
                label.classList.add("lsd-scene-editor-options-panel-attributes-label");
                attributePanel.appendChild(label);
                const colorDiv = document.createElement('div');
                colorDiv.classList.add("lsd-scene-editor-options-panel-attributes-colorPicker");
                attributePanel.appendChild(colorDiv);
                defColor = ('#' + animation[option.name].toString(16).padStart(6, '0'))
                const pickr = Pickr.create({
                    el: '.lsd-scene-editor-options-panel-attributes-colorPicker',
                    theme: 'nano', // or 'monolith', or 'nano'

                    components: {
                        // Main components
                        preview: true,
                        hue: true,
                    },

                    interaction: {
                        hex: true,

                        input: true,
                    },

                    default: defColor,
                    inline: true,
                    showAlways: true,
                });
                pickr.optionName = option.name;
                pickr.on("changestop", (eventSource, PickrInstance) => {
                    onSceneOptionChange(sceneId, segmentIndex, PickrInstance.optionName, PickrInstance.getColor().toHEXA().toString().substring(0,7));
                });
                break;
            case "int":
                const inputDiv = document.createElement('div');
                inputDiv.innerHTML = `
                    <label class="mdc-text-field mdc-text-field--outlined">
                        <span class="mdc-notched-outline">
                        <span class="mdc-notched-outline__leading"></span>
                        <span class="mdc-notched-outline__notch">
                            <span class="mdc-floating-label" id="lsd-scene-editor-options-panel-attributes-int-${option.name}">delay [ms]</span>
                        </span>
                            <span class="mdc-notched-outline__trailing"></span>
                        </span>
                        <input type="number" min="0" step="1" class="mdc-text-field__input" aria-labelledby="lsd-scene-editor-options-panel-attributes-int-${option.name}" value="${animation[option.name]}" onchange='onSceneOptionChange(${sceneId}, ${segmentIndex},"${option.name}", event.target.value)'>
                    </label>
                `;
                attributePanel.appendChild(inputDiv);
                mdc.textField.MDCTextField.attachTo(inputDiv.querySelector('.mdc-text-field'));
                break;
        }
    }
}

function findSceneSegmentIndex(sceneId, segmentId) {
    // find where segment is located in scene's segment list
    segmentIndex = -1;
    for (i = 0; i < config.scenes[sceneId].segments.length; i++) {
        if (config.scenes[sceneId].segments[i] != null && config.scenes[sceneId].segments[i].id == segmentId) {
            segmentIndex = i;
        }
    }
    return segmentIndex;
}

function onSceneOptionChange(sceneId, segmentIndex, name, value) {
    config.scenes[sceneId].segments[segmentIndex].animation[name] = value;
    sendScene(sceneId);
    requestConfig();
}

function onSceneNameChange() {
    // todo prevent double naming
    sceneId = window.location.hash.substring("#scene-edit-".length);
    config.scenes[sceneId].name = document.getElementById("lsd-scene-editor-name").textContent;
    sendScene(sceneId);
    requestConfig();
}

function deleteOpenedScene() {

}

function sendScene(sceneId) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://10.3.3.58/scene", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.send('{"scene":' + sceneId + ',"content":' + JSON.stringify(config.scenes[sceneId]) + '}');
}

function sendConfig() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://10.3.3.58/config", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.send(JSON.stringify(config));
}