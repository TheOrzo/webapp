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
                <button class="lsd-hardware-item-delete">delete</button>
                <button class="lsd-hardware-item-save">save</button>
                <h4>GPIO Pin</h4>
                <select name="pins" id="hardware_pins_${i}">
                    <option value="1">GPIO 1</option>
                    <option value="2">GPIO 2</option>
                    <option value="3">GPIO 3</option>
                    <option value="4">GPIO 4</option>
                    <option value="5">GPIO 5</option>
                </select>
                <h4>Number of LEDs</h4>
                <label class="mdc-text-field mdc-text-field--outlined">
                    <span class="mdc-notched-outline">
                    <span class="mdc-notched-outline__leading"></span>
                    <span class="mdc-notched-outline__notch">
                        <span class="mdc-floating-label" id="hwd_leds_lable">Amount</span>
                    </span>
                    <span class="mdc-notched-outline__trailing"></span>
                    </span>
                    <input  type="number" min="0" step="1" value="${config.hardware[i].num}" class="mdc-text-field__input" aria-labelledby="hwd_leds_lable">
                </label>`;
        container.appendChild(item);
        item.getElementsByTagName("select")[0].value = config.hardware[i].pin;
        item.addEventListener('change', function () {
            this.getElementsByTagName('button')[0].style.visibility = "visible";
            this.getElementsByTagName('button')[1].style.visibility = "visible";
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