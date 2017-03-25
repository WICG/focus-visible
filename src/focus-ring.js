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
        _addClass = function(el, htmlClass) {
            el.className += ' '+htmlClass;   
        },
        _removeClass = function(el, htmlClass) {
            var elClass = ' '+el.className+' ';
            while(elClass.indexOf(' '+htmlClass+' ') != -1)
                elClass = elClass.replace(' '+htmlClass+' ', '');
            el.className = elClass;
        },
        addFocusRingClass = function(el) {
            if (el.className.indexOf(focusRingClass) != -1)
                return;
            _addClass(el,focusRingClass);
            el.setAttribute(focusRingAttr, '');
        },
        removeFocusRingClass = function(el) {
            if (!el.hasAttribute(focusRingAttr))
                return;
            _removeClass(el,focusRingClass);
            el.removeAttribute(focusRingAttr)
        };

    document.body.addEventListener('keydown', function() {
        hadKeyboardEvent = true;
        if (document.activeElement) {
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