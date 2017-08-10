import classList from 'dom-classlist';

/**
 * https://github.com/WICG/focus-ring
 */
function init() {
  var hadKeyboardEvent = false;
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
   * On `keydown`, set `hadKeyboardEvent`, add `focus-ring` class if the
   * key was Tab.
   * @param {Event} e
   */
  function onKeyDown(e) {
    if (e.altKey || e.ctrlKey || e.metaKey)
      return;

    if (e.keyCode != 9)
      return;

    hadKeyboardEvent = true;
  }

  /**
   * On `focus`, add the `focus-ring` class to the target if:
   * - the target received focus as a result of keyboard navigation
   * - the event target is an element that will likely require interaction
   *   via the keyboard (e.g. a text box)
   * @param {Event} e
   */
  function onFocus(e) {
    if (e.target == document)
      return;

    if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
      addFocusRingClass(e.target);
      hadKeyboardEvent = false;
    }
  }

  /**
   * On `blur`, remove the `focus-ring` class from the target.
   * @param {Event} e
   */
  function onBlur(e) {
    if (e.target == document)
      return;

    removeFocusRingClass(e.target);
  }

  /**
   * When the window regains focus, restore the focus-ring class to the element
   * to which it was previously applied.
   */
  function onWindowFocus() {
    if (document.activeElement == elWithFocusRing)
      addFocusRingClass(elWithFocusRing);

    elWithFocusRing = null;
  }

  /**
   * When switching windows, keep track of the focused element if it has a
   * focus-ring class.
   */
  function onWindowBlur() {
    if (document.activeElement.classList.contains('focus-ring')) {
      // Keep a reference to the element to which the focus-ring class is applied
      // so the focus-ring class can be restored to it if the window regains
      // focus after being blurred.
      elWithFocusRing = document.activeElement;
    }
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
  window.addEventListener('focus', onWindowFocus, true);
  window.addEventListener('blur', onWindowBlur, true);

  document.body.classList.add('focus-ring-enabled');
}

/**
 * Subscription when the DOM is ready
 * @param {Function} callback
 */
function onDOMReady(callback) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    var loaded = false;

    /**
     * Callback wrapper for check loaded state
     */
    function load() {
      if (!loaded) {
        loaded = true;

        callback();
      }
    }

    document.addEventListener('DOMContentLoaded', load, false);
    window.addEventListener('load', load, false);
  }
}

onDOMReady(init);
