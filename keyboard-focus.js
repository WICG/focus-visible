document.addEventListener("DOMContentLoaded", function() {
    var hadKeyboardEvent = false;
    var focusedElementObserver = null;

    function isTextInput(el) {
        var hasTextboxRole = el.getAttribute("role") === "textbox",
            isTextSelectable = false;
        try {
            isTextSelectable = typeof el.selectionStart !== "undefined";
        } catch (e) {
            /* nope, it isn't... */
        }
        return isTextSelectable || hasTextboxRole;
    }

    document.body.addEventListener("keydown", function(e) {
        hadKeyboardEvent = true;
        setTimeout(function() { hadKeyboardEvent = false; }, 0);
    }, true);

    document.body.addEventListener("focus", function(e) {
        if (hadKeyboardEvent || isTextInput(e.target))
            document.body.setAttribute("using-keyboard", "");
    }, true);

    document.body.addEventListener("blur", function(e) {
        document.body.removeAttribute("using-keyboard");
    }, true);
});
