document.addEventListener("DOMContentLoaded", function() {
    var isPointIndicatable = function (el) {
       var hasTextboxRole = el.getAttribute("role") === "textbox",
            isDisabled = el.hasAttribute("disable-point-indication"),
            isTextSelectable = false;
            try {
              isTextSelectable = typeof el.selectionStart !== "undefined";
            } catch (e) {
              /* nope, it isn't... */
            }
            return !isDisabled && (!isTextSelectable && !hasTextboxRole);
    };

    document.body.addEventListener("mousedown", function(evt) {
      var el = evt.target;
      if (isPointIndicatable(el)) {
        setTimeout(function () {
          // this is really the wrong event, so we need to wait until the next cycle...
          document.body.setAttribute("point-indicated", "");
        }, 0);
      } else {
        document.body.removeAttribute("point-indicated");
      }
    });

    document.body.addEventListener("blur", function (evt) {
      document.body.removeAttribute("point-indicated")
    }, true);
});
