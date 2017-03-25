/* https://github.com/WICG/focus-ring */

document.documentElement.className += " focus-ring-polyfill";

document.addEventListener('DOMContentLoaded', function() {
    var hadKeyboardEvent = false;
    var keyboardThrottleTimeoutID = 0;

    // These elements should always have a focus ring drawn, because they are
    // associated with switching to a keyboard modality.
    var keyboardModalityWhitelist = [ 'input:not([type])',
                                      'input[type=text]',
                                      'input[type=number]',
                                      'input[type=date]',
                                      'input[type=time]',
                                      'input[type=datetime]',
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
        if (el.classList.contains('focus-ring'))
            return;
        el.classList.add('focus-ring');
        el.setAttribute('data-focus-ring-added', '');
    }

    /**
     * Remove the `focus-ring` class from the given element if it was not
     * originally added by the author.
     * @param {Element} el
     */
    function removeFocusRingClass(el) {
        if (!el.hasAttribute('data-focus-ring-added'))
            return;
        el.classList.remove('focus-ring');
        el.removeAttribute('data-focus-ring-added')
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
            clearTimeout(isHandlingKeyboardThrottle);
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
