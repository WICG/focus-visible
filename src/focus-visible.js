/**
 * https://github.com/WICG/focus-ring
 */
function init() {
  var hadKeyboardEvent = true;
  var elWithFocusRing;

  var inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    'datetime-local': true
  };

  /**
   * Computes whether the given element should automatically trigger the
   * `focus-visible` class being added, i.e. whether it should always match
   * `:focus-visible` when focused.
   * @param {Element} el
   * @return {boolean}
   */
  function focusTriggersKeyboardModality(el) {
    var type = el.type;
    var tagName = el.tagName;

    if (tagName == 'INPUT' && inputTypesWhitelist[type] && !el.readonly) {
      return true;
    }

    if (tagName == 'TEXTAREA' && !el.readonly) {
      return true;
    }

    if (el.contentEditable == 'true') {
      return true;
    }

    return false;
  }

  /**
   * Add the `focus-visible` class to the given element if it was not added by
   * the author.
   * @param {Element} el
   */
  function addFocusRingClass(el) {
    if (el.classList.contains('focus-visible')) {
      return;
    }
    el.classList.add('focus-visible');
    el.setAttribute('data-focus-visible-added', '');
  }

  /**
   * Remove the `focus-visible` class from the given element if it was not
   * originally added by the author.
   * @param {Element} el
   */
  function removeFocusRingClass(el) {
    if (!el.hasAttribute('data-focus-visible-added')) {
      return;
    }
    el.classList.remove('focus-visible');
    el.removeAttribute('data-focus-visible-added');
  }

  /**
   * On `keydown`, set `hadKeyboardEvent`, add `focus-visible` class if the
   * key was Tab/Shift-Tab or Arrow Keys.
   * @param {Event} e
   */
  function onKeyDown(e) {
    var allowedKeys = [
      9, // TAB
      37, // LEFT
      38, // UP
      39, // RIGHT
      40 // DOWN
    ];

    // Ignore keypresses if the user is holding down a modifier key.
    if (e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }

    // Ignore keypresses which aren't related to keyboard navigation.
    if (allowedKeys.indexOf(e.keyCode) === -1) {
      return;
    }

    hadKeyboardEvent = true;
  }

  /**
   * On `focus`, add the `focus-visible` class to the target if:
   * - the target received focus as a result of keyboard navigation, or
   * - the event target is an element that will likely require interaction
   *   via the keyboard (e.g. a text box)
   * @param {Event} e
   */
  function onFocus(e) {
    if (e.target == document) {
      return;
    }

    if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
      addFocusRingClass(e.target);
      hadKeyboardEvent = false;
    }
  }

  /**
   * On `blur`, remove the `focus-visible` class from the target.
   * @param {Event} e
   */
  function onBlur(e) {
    if (e.target == document) {
      return;
    }

    removeFocusRingClass(e.target);
  }

  /**
   * When the window regains focus, restore the focus-visible class to the element
   * to which it was previously applied.
   */
  function onWindowFocus() {
    // When removing the activeElement from DOM it's possible IE11 is in state
    // document.activeElement === null
    if (!document.activeElement) {
      return;
    }

    if (document.activeElement == elWithFocusRing) {
      addFocusRingClass(elWithFocusRing);
    }

    elWithFocusRing = null;
  }

  /**
   * When switching windows, keep track of the focused element if it has a
   * focus-visible class.
   * @param {Event} e
   */
  function onWindowBlur(e) {
    if (e.target !== window) {
      return;
    }

    // When removing the activeElement from DOM it's possible IE11 is in state
    // document.activeElement === null
    if (!document.activeElement) {
      return;
    }

    // Set initial state back to assuming that the user is relying on the keyboard.
    // And add listeners to detect if they use a pointing device instead.
    hadKeyboardEvent = true;
    addInitialPointerMoveListeners();

    if (document.activeElement.classList.contains('focus-visible')) {
      // Keep a reference to the element to which the focus-visible class is
      // applied so the focus-visible class can be restored to it if the window
      // regains focus after being blurred.
      elWithFocusRing = document.activeElement;
    }
  }

  /**
   * Add a group of listeners to detect usage of any pointing devices.
   * These listeners will be added when the polyfill first loads, and anytime
   * the window is blurred, so that they are active when the window regains focus.
   */
  function addInitialPointerMoveListeners() {
    document.addEventListener('mousemove', onInitialPointerMove);
    document.addEventListener('mousedown', onInitialPointerMove);
    document.addEventListener('mouseup', onInitialPointerMove);
    document.addEventListener('pointermove', onInitialPointerMove);
    document.addEventListener('pointerdown', onInitialPointerMove);
    document.addEventListener('pointerup', onInitialPointerMove);
    document.addEventListener('touchmove', onInitialPointerMove);
    document.addEventListener('touchstart', onInitialPointerMove);
    document.addEventListener('touchend', onInitialPointerMove);
  }

  /**
   * When the polfyill first loads, assume the user is in keyboard modality.
   * If any event is received from a pointing device (e.g mouse, pointer, touch), turn off
   * keyboard modality.
   * This accounts for situations where focus enters the page from the URL bar.
   * @param {Event} e
   */
  function onInitialPointerMove(e) {
    // Work around a Safari quirk that fires a mousemove on <html> whenever the
    // window blurs, even if you're tabbing out of the page. ¯\_(ツ)_/¯
    if (e.target.nodeName.toLowerCase() === 'html') {
      return;
    }

    hadKeyboardEvent = false;
    document.removeEventListener('mousemove', onInitialPointerMove);
    document.removeEventListener('mousedown', onInitialPointerMove);
    document.removeEventListener('mouseup', onInitialPointerMove);
    document.removeEventListener('pointermove', onInitialPointerMove);
    document.removeEventListener('pointerdown', onInitialPointerMove);
    document.removeEventListener('pointerup', onInitialPointerMove);
    document.removeEventListener('touchmove', onInitialPointerMove);
    document.removeEventListener('touchstart', onInitialPointerMove);
    document.removeEventListener('touchend', onInitialPointerMove);
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
  window.addEventListener('focus', onWindowFocus, true);
  window.addEventListener('blur', onWindowBlur, true);
  addInitialPointerMoveListeners();

  document.body.classList.add('js-focus-visible');
}

/**
 * Subscription when the DOM is ready
 * @param {Function} callback
 */
function onDOMReady(callback) {
  var loaded;

  /**
   * Callback wrapper for check loaded state
   */
  function load() {
    if (!loaded) {
      loaded = true;

      callback();
    }
  }

  if (document.readyState === 'complete') {
    callback();
  } else {
    loaded = false;
    document.addEventListener('DOMContentLoaded', load, false);
    window.addEventListener('load', load, false);
  }
}

onDOMReady(init);
