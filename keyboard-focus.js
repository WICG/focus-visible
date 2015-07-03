document.addEventListener("DOMContentLoaded", function() {
    var hadKeyboardEvent = false,
        showFocusRingWhitelist = [ "input:not([type])",
                                   "input[type=text]",
                                   "input[type=number]",
                                   "input[type=date]",
                                   "input[type=time]",
                                   "input[type=datetime]",
                                   "textarea",
                                   "[role=textbox]",
                                   "[show-focus]"].join(",");

    function matchesSelector(el, selector) {
        if (el.matchesSelector)
            return el.matchesSelector(selector);
        if (el.webkitMatchesSelector)
            return el.webkitMatchesSelector(selector);
        if (el.mozMatchesSelector)
            return el.mozMatchesSelector(selector);
        if (el.msMatchesSelector)
            return el.msMatchesSelector(selector);
        return false;
    }

    function shouldShowFocusRing(el) {
        return matchesSelector(el, showFocusRingWhitelist);
    }

    document.body.addEventListener("keydown", function(e) {
        hadKeyboardEvent = true;
        setTimeout(function() { hadKeyboardEvent = false; }, 0);
    }, true);

    document.body.addEventListener("focus", function(e) {
        if (hadKeyboardEvent || shouldShowFocusRing(e.target))
            document.body.setAttribute("show-focus", "");
    }, true);

    document.body.addEventListener("blur", function(e) {
        document.body.removeAttribute("show-focus");
    }, true);
});
