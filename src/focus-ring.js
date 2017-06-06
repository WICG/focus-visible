import classList from 'dom-classlist';

/* https://github.com/WICG/focus-ring */
document.addEventListener('DOMContentLoaded', function() {
  var hadKeyboardEvent = false;
  var keyboardThrottleTimeoutID = 0;
  var elWithFocusRing;

  var inputTypesWhitelist = {
    'text': true,
    'search': true,
    'url': true,
    'tel': true,
    'email': true,
    'password': true,
    'number': true,
    'date': true,
    'month': true,
    'week': true,
    'time': true,
    'datetime': true,
    'datetime-local': true,
  };

  /**
   * Computes whether the given element should automatically trigger the
   * `focus-ring` class being added, i.e. whether it should always match
   * `:focus-ring` when focused.
   * @param {Element} el
   * @return {boolean}
   */
  function focusTriggersKeyboardModality(el) {
    var type = el.type;
    var tagName = el.tagName;

    if (tagName == 'INPUT' && inputTypesWhitelist[type] && !el.readonly)
      return true;

    if (tagName == 'TEXTAREA' && !el.readonly)
      return true;

    if (el.contentEditable == 'true')
      return true;

    return false;
  }

  /**
   * Add the `focus-ring` class to the given element if it was not added by
   * the author.
   * @param {Element} el
   */
  function addFocusRingClass(el) {
    if (classList(el).contains('focus-ring'))
      return;
    classList(el).add('focus-ring');
    el.setAttribute('data-focus-ring-added', '');
    // Keep a reference to the element to which the focus-ring class is applied
    // so the focus-ring class can be restored to it if the window regains
    // focus after being blurred.
    elWithFocusRing = el;
  }

  /**
   * Remove the `focus-ring` class from the given element if it was not
   * originally added by the author.
   * @param {Element} el
   */
  function removeFocusRingClass(el) {
    if (!el.hasAttribute('data-focus-ring-added'))
      return;
    classList(el).remove('focus-ring');
    el.removeAttribute('data-focus-ring-added');
  }

  /**
   * On `keydown`, set `hadKeyboardEvent`, to be removed 100ms later if there
   * are no further keyboard events.  The 100ms throttle handles cases where
   * focus is redirected programmatically after a keyboard event, such as
   * opening a menu or dialog.
   */
  function onKeyDown() {
    // `activeElement` defaults to document.body if nothing focused,
    // so check the active element is actually focused.
    var activeElement = document.activeElement;
    if (activeElement.tagName == 'BODY')
      return;

    hadKeyboardEvent = true;
    if (keyboardThrottleTimeoutID !== 0)
      clearTimeout(keyboardThrottleTimeoutID);
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
    if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target))
      addFocusRingClass(e.target);
  }

  /**
   * On `blur`, remove the `focus-ring` class from the target.
   * @param {Event} e
   */
  function onBlur(e) {
    removeFocusRingClass(e.target);
  }

  /**
   * When the window regains focus, restore the focus-ring class to the element
   * to which it was previously applied.
   */
  function onWindowFocus() {
    if (document.activeElement == elWithFocusRing) {
      addFocusRingClass(elWithFocusRing);
    }
  }

  document.body.addEventListener('keydown', onKeyDown, true);
  document.body.addEventListener('focus', onFocus, true);
  document.body.addEventListener('blur', onBlur, true);
  window.addEventListener('focus', onWindowFocus, true);
});
