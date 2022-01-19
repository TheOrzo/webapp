var mobileMaxSize = 480; // size in px (= 30rem)
var config = JSON.parse('{"hardware":[{"name":"Left stripe","pin":3,"num":10},{"name":"Right stripe","pin":5,"num":10}],"segments":[{"name":"Schreibtisch","segments":[{"hardware":0,"start":0,"end":10}]}],"scenes":[{"name":"Schreibtisch rot","segments":[0],"animation":[{"name":"static","color":"#ff0000"}],"panelColor":"#cc3333"},{"name":"Schreibtisch blau","segments":[0],"animation":[{"name":"static","color":"#0000ff"}],"panelColor":"#3333cc"}]}');

window.addEventListener('popstate', function () {
    scrollToCurrentPanel();
})

window.addEventListener('load', function () {
    scrollToCurrentPanel();
    applyConfig();
})

function scrollToCurrentPanel() {
    if (window.location.hash == '') {
        this.location.href = "#scenes";
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

function loadHardwareConfig() {
    var container = document.getElementById("lsd_hardware_container");
    container.innerHTML = "";
    for (i = 0; i < config.hardware.length; i++) {
        const item = document.createElement("form");
        item.classList.add("lsd-hardware-item");
        item.id = ("hardware" + i);
        item.innerHTML = `
                <h2>${config.hardware[i].name}</h2>
                <div class="mdc-touch-target-wrapper">
                    <button class="mdc-button mdc-button--touch">
                        <span class="mdc-button__ripple"></span>
                        <span class="mdc-button__touch"></span>
                        <span class="mdc-button__label">delete</span>
                    </button>
                </div>
                <div class="mdc-touch-target-wrapper">
                    <button class="mdc-button mdc-button--touch">
                        <span class="mdc-button__ripple"></span>
                        <span class="mdc-button__touch"></span>
                        <span class="mdc-button__label">save</span>
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
                    <input  type="number" min="0" step="1" value="${config.hardware[i].num}" class="mdc-text-field__input" aria-labelledby="hwd_leds_lable">
                </label>`;
                
        const list = item.querySelector(".mdc-list");
        for (let li of list.children) {
            if (li.getAttribute("data-value") == config.hardware[i].pin) {
                li.classList.add("mdc-list-item--selected");
            }
        }
        container.appendChild(item);
        const select = mdc.select.MDCSelect.attachTo(item.querySelector(".mdc-select"));
        select.listen('MDCSelect:change', () => {
            item.getElementsByTagName('button')[0].style.visibility = "visible";
            item.getElementsByTagName('button')[1].style.visibility = "visible";
        });
        const pin = mdc.textField.MDCTextField.attachTo(item.querySelector(".mdc-text-field"));
        pin.listen('MDCTextField:change', () => {
            item.getElementsByTagName('button')[0].style.visibility = "visible";
            item.getElementsByTagName('button')[1].style.visibility = "visible";
        });
    }
    let spacer = document.createElement("div");
    spacer.classList.add("lsd-hardware-item");
    spacer.classList.add("spacer");
    container.appendChild(spacer.cloneNode());
    container.appendChild(spacer.cloneNode());
    container.appendChild(spacer);


    for (let input of document.getElementsByClassName("mdc-text-field")) {
        mdc.textField.MDCTextField.attachTo(input);
    }
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
                <h2>${config.scenes[i].name}</h2>
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