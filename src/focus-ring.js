/* https://github.com/WICG/focus-ring */
document.addEventListener('DOMContentLoaded', function() {
    var hadKeyboardEvent = false,
        focusRingClass = 'focus-ring',
        focusRingAttr = 'data-focus-ring-added',
        keyboardModalityWhitelist = [ 'input:not([type])',
                                      'input[type=text]',
                                      'input[type=number]',
                                      'input[type=date]',
                                      'input[type=time]',
                                      'input[type=datetime]',
                                      'textarea',
                                      '[role=textbox]' ].join(','),
        isHandlingKeyboardThrottle,
        matcher = (function () {
	    var el = document.body;
	    if (el.matchesSelector)
		return el.matchesSelector;
	    if (el.webkitMatchesSelector)
		return el.webkitMatchesSelector;
	    if (el.mozMatchesSelector)
		return el.mozMatchesSelector;
	    if (el.msMatchesSelector)
		return el.msMatchesSelector;
	    console.error('Couldn\'t find any matchesSelector method on document.body.');
	}()),
	focusTriggersKeyboardModality = function (el) {
	    var triggers = false;
	    if (matcher) {
		triggers = matcher.call(el, keyboardModalityWhitelist) && matcher.call(el, ':not([readonly]');
	    }
	    return triggers;
	},
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/classList#Polyfill
    regExp = function(name) {
	    return new RegExp('(^| )'+ name +'( |$)');
    },
    forEach = function(list, fn, scope) {
        for (var i = 0; i < list.length; i++) {
            fn.call(scope, list[i]);
        }
    },
    addClass = function(el, htmlClass) {
        el.className += ' '+htmlClass;
    },
    removeClass = function(el, htmlClass) {
        forEach(el, function(htmlClass) {
            this.element.className =
                this.element.className.replace(regExp(name), '');
        }, this);
    },
    addFocusRingClass = function(el) {
        if (el.className.indexOf(focusRingClass) != -1)
            return;
        addClass(el,focusRingClass);
        el.setAttribute(focusRingAttr, '');
    },
    removeFocusRingClass = function(el) {
        if (!el.hasAttribute(focusRingAttr))
            return;
        removeClass(el,focusRingClass);
        el.removeAttribute(focusRingAttr)
    };
    document.body.addEventListener('keydown', function() {
        hadKeyboardEvent = true;
        if (document.activeElement && document.activeElement !== document.body) {
            addFocusRingClass(document.activeElement);
        }
        if (isHandlingKeyboardThrottle) {
            clearTimeout(isHandlingKeyboardThrottle);
        }
        isHandlingKeyboardThrottle = setTimeout(function() {
            hadKeyboardEvent = false;
        }, 100);
    }, true);
    document.body.addEventListener('focus', function(e) {
        if (!hadKeyboardEvent && !focusTriggersKeyboardModality(e.target))
            return;
        addFocusRingClass(e.target);
    }, true);
    document.body.addEventListener('blur', function(e) {
        removeFocusRingClass(e.target)
    }, true);
});
