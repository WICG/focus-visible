import classList from 'dom-classlist';

/**
 * https://github.com/WICG/focus-ring
 */
function init() {
  var elWithFocusRing;

  var inputTypesWhitelist = {
    'radio': true,
    'checkbox': true,
    'button': true,
    'reset': true,
    'submit': true,
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
   * On `keyup` add `focus-ring` class if the user pressed Tab and the event
   * target is an element that will likely require interaction via the
   * keyboard (e.g. a text box).
   * The `keyup` event is used over the focus event because:
   * 1. `focus` is a device-independent event, and `keyup` ensures the
   *    `focus-ring` class is only added when focus originates from
   *    keyboard navigation.
   * 2. Unlike `focus`, keyup` will fire when the user navigates from the
   *    browser chrome into the document. (For more, see issue #15)
   * @param {Event} e
   */
  function onKeyUp(e) {
    if (e.altKey || e.ctrlKey || e.metaKey)
      return;

    if (e.keyCode != 9)
      return;

    var target = e.target;
    if (focusTriggersKeyboardModality(target)) {
      addFocusRingClass(target);
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
    // When removing the activeElement from DOM it's possible IE11 is in state
    // document.activeElement === null
    if (!document.activeElement)
      return;
    if (document.activeElement == elWithFocusRing)
      addFocusRingClass(elWithFocusRing);

    elWithFocusRing = null;
  }

  /**
   * When switching windows, keep track of the focused element if it has a
   * focus-ring class.
   */
  function onWindowBlur() {
    // When removing the activeElement from DOM it's possible IE11 is in state
    // document.activeElement === null
    if (!document.activeElement)
      return;
    if (classList(document.activeElement).contains('focus-ring')) {
      // Keep a reference to the element to which the focus-ring class is applied
      // so the focus-ring class can be restored to it if the window regains
      // focus after being blurred.
      elWithFocusRing = document.activeElement;
    }
  }

  document.addEventListener('keyup', onKeyUp, true);
  document.addEventListener('blur', onBlur, true);
  window.addEventListener('focus', onWindowFocus, true);
  window.addEventListener('blur', onWindowBlur, true);

  classList(document.body).add('js-focus-ring');
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
