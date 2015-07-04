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
                                   "[show-focus]"].join(","),
        matcher = getMatcher();


    function getMatcher() {
        var el = document.body;
        if (el.matchesSelector)
            return el.matchesSelector;
        if (el.webkitMatchesSelector)
            return el.webkitMatchesSelector;
        if (el.mozMatchesSelector)
            return el.mozMatchesSelector;
        if (el.msMatchesSelector)
            return el.msMatchesSelector;
        throw "Couldn't find any matchesSelector method on document.body."
    }

    function shouldShowFocusRing(el) {
        return matcher.call(el, showFocusRingWhitelist);
    }

    document.body.addEventListener("keydown", function(e) {
        hadKeyboardEvent = true;
        setTimeout(function() { hadKeyboardEvent = false; }, 0);
    }, true);

    document.body.addEventListener("focus", function(e) {
        if (hadKeyboardEvent || shouldShowFocusRing(e.target))
            document.body.setAttribute("input-modality", "keyboard");
    }, true);

    document.body.addEventListener("blur", function(e) {
        document.body.removeAttribute("input-modality");
    }, true);
});
