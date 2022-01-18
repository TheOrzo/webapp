var mobileMaxSize = 480; // size in px (= 30rem)
var config = JSON.parse('{"hardware":[{"name":"Left stripe","pin":3,"num":10},{"name":"Right stripe","pin":5,"num":10}],"segments":[],"scenes":[]}')

window.addEventListener('popstate', function () {
    scrollToCurrentPanel();
})

window.addEventListener('load', function () {
    scrollToCurrentPanel();
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
    .then(function(response) { return response.json(); })
    .then(function(json) {
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
                <button>save</button>
                <label for="pins">GPIO Pin</label>
                <select name="pins" id="hardware_pins_${i}">
                    <option value="1">GPIO 1</option>
                    <option value="2">GPIO 2</option>
                    <option value="3">GPIO 3</option>
                    <option value="4">GPIO 4</option>
                    <option value="5">GPIO 5</option>
                </select>
                <label>Number of LEDs</label>
                <input type="number" min="0" step="1" value="${config.hardware[i].num}">`;
        container.appendChild(item);
        document.getElementById("hardware_pins_" + i).value = config.hardware[i].pin;
        document.getElementById("hardware" + i).addEventListener('change', function() {
            this.getElementsByTagName('button')[0].style.visibility = "visible";
        })
    }
    container.innerHTML += `<div class="lsd-hardware-item spacer"></div>
    <div class="lsd-hardware-item spacer"></div>
    <div class="lsd-hardware-item spacer"></div>`;
}

function loadSegmentConfig() {

}

function loadScenes() {

}