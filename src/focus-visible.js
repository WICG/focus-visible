/**
 * https://github.com/WICG/focus-ring
 */
function init() {
  var elementToBePointerFocused = null;
  var forceNoFocusVisible = false;
  var hadFocusVisibleRecently = false;
  var hadFocusVisibleRecentlyTimeout = null;

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
  function addFocusVisibleClass(el) {
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
  function removeFocusVisibleClass(el) {
    if (!el.hasAttribute('data-focus-visible-added')) {
      return;
    }
    el.classList.remove('focus-visible');
    el.removeAttribute('data-focus-visible-added');
  }

  /**
   * On `keydown`, disable the forceNoFocusVisible flag.
   * This flag should be off if a user action is taking place.
   * @param {Event} e
   */
  function onKeyDown(e) {
    forceNoFocusVisible = false;
  }

  /**
   * On any pointer down event (e.g. touchstart, mousedown, pointerdown),
   * disable the forceNoFocusVisible flag.
   * This flag should be off if a user action is taking place.
   * Also, keep track of the clicked on element.
   * This is useful for determining if clicking on an element calls focus() on a
   * different element.
   * @param {Event} e
   */
  function onPointerDown(e) {
    forceNoFocusVisible = false;
    elementToBePointerFocused = e.target;
    // Clicking inside of a <select multiple> element will fire a mousedown
    // on the <option> child, but focus will be set on the <select> itself.
    if (elementToBePointerFocused.nodeName == 'OPTION') {
      elementToBePointerFocused = elementToBePointerFocused.parentElement;
    }
  }

  /**
   * On `focus`, add the `focus-visible` class to the target if:
   * - the target received focus as a result of keyboard navigation, or
   * - the target is an element that will likely require interaction via the
   *   keyboard (e.g. <input type="text">), or
   * - an element called focus() on the target.
   * @param {Event} e
   */
  function onFocus(e) {
    // Prevent IE from focusing the document or HTML element.
    if (e.target == document || e.target.nodeName == 'HTML') {
      return;
    }

    // Prevent switching to a new tab from looking like a user-initiated focus
    // event.
    if (forceNoFocusVisible) {
      return;
    }

    // If there is no elementToBePointerFocused, then focus is coming from
    // the keyboard. This should always apply `focus-visible`.
    if (!elementToBePointerFocused) {
      addFocusVisibleClass(e.target);
      return;
    }

    if (elementToBePointerFocused) {
      // - Force focus-visible for elements like <input type="text">, or
      // - Force focus-visible if the clicked on element is calling
      //   focus() on a different element.
      if (
        focusTriggersKeyboardModality(e.target) ||
        elementToBePointerFocused != e.target
      ) {
        addFocusVisibleClass(e.target);
      }
      elementToBePointerFocused = null;
    }
  }

  /**
   * On `blur`, remove the `focus-visible` class from the target.
   * @param {Event} e
   */
  function onBlur(e) {
    if (e.target == document || e.target.nodeName == 'HTML') {
      return;
    }

    if (e.target.classList.contains('focus-visible')) {
      // To detect a tab/window switch, we look for a blur event followed
      // rapidly by a visibility change.
      // If we don't see a visibility change within 100ms, it's probably a
      // regular focus change.
      hadFocusVisibleRecently = true;
      window.clearTimeout(hadFocusVisibleRecentlyTimeout);
      hadFocusVisibleRecentlyTimeout = window.setTimeout(function() {
        hadFocusVisibleRecently = false;
        window.clearTimeout(hadFocusVisibleRecentlyTimeout);
      }, 100);
      removeFocusVisibleClass(e.target);
    }
  }

  /**
   * If the user changes tabs, keep track of whether or not the previously
   * focused element had `focus-visible`.
   * @param {Event} e
   */
  function onVisibilityChange(e) {
    if (document.visibilityState == 'hidden') {
      // !!! Important Note !!!
      // If the tab becomes active again, the browser will handle calling focus
      // on the element. Each browser does this in a different order.
      // https://github.com/WICG/focus-visible/issues/115#issuecomment-363568291
      // Safari will actually call focus on the same element twice.

      // If the tab becomes active again, and the previously focused element
      // did NOT have focus-visible, we need to indicate that.
      if (!hadFocusVisibleRecently) {
        // This flag ensures that when the newly active tab spams the element
        // with focus events, it doesn't look like user-initiated focus.
        // The only way to turn this flag off is for the user to take an action
        // such as pressing a key, or clicking the mouse.
        forceNoFocusVisible = true;
        return;
      }
    }
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mousedown', onPointerDown, true);
  document.addEventListener('touchstart', onPointerDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
  document.addEventListener('visibilitychange', onVisibilityChange, true);

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
