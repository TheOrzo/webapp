var mobileMaxSize = 480; // size in px (= 30rem)

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