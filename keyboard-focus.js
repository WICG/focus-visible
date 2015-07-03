document.addEventListener("DOMContentLoaded", function() {
    var hadKeyboardEvent = false;
    var focusedElementObserver = null;
    var lastState = {};

    function compareAndUpdateLastState(el, p) {
        if (!(p in el))
            return;

        if (p in lastState && el[p] !== lastState[p])
            document.body.setAttribute("using-keyboard", "");
        lastState[p] = el[p];
    }

    document.body.addEventListener("keydown", function(e) {
        hadKeyboardEvent = true;
        setTimeout(function() { hadKeyboardEvent = false; }, 0);
    }, true);

    document.body.addEventListener("keyup", function(e) {
        // If the focused element gets a character data or selection mutation from the keyboard,
        // set using-keyboard even if it was focused via a pointing device.
        compareAndUpdateLastState(e.target, "value");
        compareAndUpdateLastState(e.target, "selectionStart");
    }, true);

    document.body.addEventListener("focus", function(e) {
        if (hadKeyboardEvent)
            document.body.setAttribute("using-keyboard", "");

        // If the focused element gets a character data mutation from the keyboard,
        // set using-keyboard even if it was focused via a pointing device.
        focusedElementObserver = new MutationObserver(function(mutations) {
            console.log("observed mutation");
            if (hadKeyboardEvent && !document.body.hasAttribute("using-keyboard"))
                document.body.setAttribute("using-keyboard", "");
        });
        console.log("observing", e.target);
        focusedElementObserver.observe(e.target, {attributes: true, characterData: true, childList: true});

        if ("value" in e.target)
            lastState.value = e.target.value;
        if ("selectionStart" in e.target)
            lastState.selectionStart = e.target.selectionStart;
    }, true);

    document.body.addEventListener("blur", function(e) {
        document.body.removeAttribute("using-keyboard");
        if (focusedElementObserver !== null) {
            console.log("removing focusedElementObserver");
            focusedElementObserver.disconnect();
            focusedElementObserver = null;
        }
        for (var p in lastState)
            delete lastState[p];
    }, true);
});
