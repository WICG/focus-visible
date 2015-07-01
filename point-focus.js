document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("mousedown", function (evt) {
        if (!evt.target.setSelectionRange || evt.target.role === 'textbox' || evt.target.hasAttribute("disable-point-focus")) {
                evt.target.setAttribute("point-focused", true); 
        }
    });
    document.body.addEventListener("blur", function (evt) {
       evt.srcElement.removeAttribute("point-focused");
    }, true);
});
