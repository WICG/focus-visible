document.addEventListener("DOMContentLoaded", function() {
  document.body.addEventListener("mousedown", function(evt) {
   var t = evt.srcElement;
    if (!t.setSelectionRange && t.getAttribute("role") !== 'textbox' || t.hasAttribute("disable-point-focus")) {
      document.body.setAttribute("point-focused", true);
    }
  });
  document.body.addEventListener("blur", function(evt) {
    document.body.removeAttribute("point-focused");
  }, true);
});
