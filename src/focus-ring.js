/* https://github.com/WICG/focus-ring */
document.addEventListener('DOMContentLoaded', function() {

    var hadKeyboardEvent = false,
        keyboardThrottleTimeoutID = 0,
        focusRingClass = 'focus-ring',
        focusRingAttr = 'data-focus-ring-added',
        matchClassRegEx = regExp(focusRingClass),

        // These elements should always have a focus ring drawn, because they are
        // associated with switching to a keyboard modality.
        keyboardModalityWhitelist = [ 'input:not([type])',
                                      'input[type=text]',
                                      'input[type=search]',
                                      'input[type=url]',
                                      'input[type=tel]',
                                      'input[type=email]',
                                      'input[type=password]',
                                      'input[type=number]',
                                      'input[type=date]',
                                      'input[type=month]',
                                      'input[type=week]',
                                      'input[type=time]',
                                      'input[type=datetime]',
                                      'input[type=datetime-local]',
                                      'textarea',
                                      '[role=textbox]' ].join(',');

    var matchesFunction = (function() {
        var proto = Element.prototype;
        if (proto.matches)
            return proto.matches;
        if (proto.matchesSelector)
            return proto.matchesSelector;
        if (proto.webkitMatchesSelector)
            return proto.webkitMatchesSelector;
        if (proto.mozMatchesSelector)
            return proto.mozMatchesSelector;
        if (proto.msMatchesSelector)
            return proto.msMatchesSelector;
        console.error('Couldn\'t find a matches method on Element.prototype.');
    }());

    /**
     * Regex helper function.
     * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList#Polyfill
     * @param {Element} name
     * @return {string}
     */
    function regExp(name) {
	    return new RegExp('(^|\\W)'+name+'($|\\W)', 'gi');
    }

    /**
     * Computes whether the given element should automatically trigger the
     * `focus-ring` class being added, i.e. whether it should always match
     * `:focus-ring` when focused.
     * @param {Element} el
     * @return {boolean}
     */
    function focusTriggersKeyboardModality(el) {
        var triggers = false;
        if (matchesFunction) {
            triggers = matchesFunction.call(el, keyboardModalityWhitelist) &&
                       matchesFunction.call(el, ':not([readonly]');
        }
        return triggers;
    }

    /**
     * Add the `focus-ring` class to the given element if it was not added by
     * the author.
     * @param {Element} el
     */
    function addFocusRingClass(el) {
		if(matchClassRegEx.test(el.className)) {
            return;
        }
        if (el.className !== '') {
            el.className += ' '+focusRingClass;
        } else {
            el.className = focusRingClass;
        }
        el.setAttribute(focusRingAttr, '');
    }

    /**
     * Remove the `focus-ring` class from the given element if it was not
     * originally added by the author.
     * @param {Element} el
     */
    function removeFocusRingClass(el) {
        if (!el.hasAttribute(focusRingAttr)){
            return;
        }
        var elClass = el.className;
        while(elClass.indexOf(focusRingClass) != -1){
            elClass = elClass.replace(matchClassRegEx, '');
        }
        el.className = elClass;
        el.removeAttribute(focusRingAttr)
    }

    /**
     * On `keydown`, set `hadKeyboardEvent`, to be removed 100ms later if there
     * are no further keyboard events.  The 100ms throttle handles cases where
     * focus is redirected programmatically after a keyboard event, such as
     * opening a menu or dialog.
     */
    function onKeyDown() {
        hadKeyboardEvent = true;
        // `activeElement` defaults to document.body if nothing focused,
        // so check the active element is actually focused.
        if (matchesFunction &&
            matchesFunction.call(document.activeElement, ':focus')) {
            addFocusRingClass(document.activeElement);
        }
        if (keyboardThrottleTimeoutID !== 0) {
            clearTimeout(keyboardThrottleTimeoutID);
        }
        keyboardThrottleTimeoutID = setTimeout(function() {
            hadKeyboardEvent = false;
            keyboardThrottleTimeoutID = 0;
        }, 100);
    }

    /**
     * On `focus`, add the `focus-ring` class to the target if:
     * - a keyboard event happened in the past 100ms, or
     * - the focus event target triggers "keyboard modality" and should always
     *   have a focus ring drawn.
     * @param {Event} e
     */
    function onFocus(e) {
        if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
            addFocusRingClass(e.target);
        }
    }

    /**
     * On `blur`, remove the `focus-ring` class from the target.
     * @param {Event} e
     */
    function onBlur(e) {
        removeFocusRingClass(e.target)
    }

    document.body.addEventListener('keydown', onKeyDown, true);
    document.body.addEventListener('focus', onFocus, true);
    document.body.addEventListener('blur', onBlur, true);
});
