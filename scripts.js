const mobileMaxSize = 480; // size in px (= 30rem)
var config = JSON.parse('{"hardware":[{"name":"Left stripe","pin":3,"num":10},{"name":"Right stripe","pin":5,"num":10}],"segments":[{"name":"Schreibtisch","segments":[{"hardware":0,"start":0,"end":10}]}],"scenes":[{"name":"Schreibtisch rot","segments":[0],"animation":[{"name":"static","color":"#ff0000"}],"panelColor":"#cc3333"},{"name":"Schreibtisch blau","segments":[0],"animation":[{"name":"static","color":"#0000ff"}],"panelColor":"#3333cc"}]}');
const animationTemplates = JSON.parse(`{"animations":[
                                       {"name":"static","options":[{"name":"color","type":"color","value":"#F00"}]},
                                       {"name":"transition","options":[{"name":"color 1","type":"color","value":"#F00"},{"name":"color 2","type":"color","value":"#0F0"}]},
                                       {"name":"fade","options":[{"name":"delay[ms]","type":"int","value":"1000"},{"name":"color 1","type":"color","value":"#00F"},{"name":"color 2","type":"color","value":"#0FF"}]}]}`);

window.addEventListener('popstate', function () {
    scrollToCurrentPanel();
})

window.addEventListener('load', function () {
    scrollToCurrentPanel();
    applyConfig();
    initButtonListeners();
})

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
    fetch('http://jsonplaceholder.typicode.com/users', {
        method: 'GET'
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
            config = json;
            applyConfig();
        });
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

function loadSceneEdit(id) {
    const scenes_container = document.getElementById("lsd_scene_editor");
    const errorField = document.getElementById("lsd_scene_editor_error");
    const selectAnimationElmt = scenes_container.querySelector(".mdc-select");
    const list = document.getElementById("lsd_scene_editor_animation_list");
    const editor = document.getElementById("lsd_scene_editor_options");

    // reset
    errorField.classList.add("hidden");
    selectAnimationElmt.classList.add("hidden");
    list.innerHTML = "";
    editor.innerHTML = "";

    if (config.scenes[id] == null) {
        errorField.innerText = "Scene could not be found";
        errorField.classList.remove("hidden");
        return;
    }

    // build animation list
    id = 0;
    for (let li of animationTemplates.animations) {
        const listItem = document.createElement('li');
        listItem.classList.add("mdc-list-item");
        listItem.setAttribute("data-value", id++);
        const listItemText = document.createElement('span');
        listItemText.classList.add("mdc-list-item__text");
        listItemText.textContent = li.name;
        listItem.appendChild(listItemText);
        list.appendChild(listItem);
    }

    // initiate animation select menu
    selectAnimationElmt.classList.remove("hidden");
    const selectAnimation = mdc.select.MDCSelect.attachTo(selectAnimationElmt);
    selectAnimation.listen('MDCSelect:change', (event) => {
        // clean options
        editor.innerHTML = "";
        // build options
        id = event.detail.value;
        for (let option of animationTemplates.animations[id].options) {
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

                        default: option.value,
                        inline: true,
                        showAlways: true,
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
                            <input type="number" min="0" step="1" class="mdc-text-field__input" aria-labelledby="lsd-scene-editor-options-panel-attributes-int-${option.name}" value="${option.value}">
                        </label>
                    `;
                    attributePanel.appendChild(inputDiv);
                    mdc.textField.MDCTextField.attachTo(inputDiv.querySelector('.mdc-text-field'));
                    break;
            }
        }
    });
}