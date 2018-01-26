/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * source: https://gist.github.com/samthor/7b307408e73784971ef0fcf4a8af6edd#file-shadowlisten-js-L38
 */

/**
 * @fileoverview Listener to provide Shadow DOM focus events, even inside shadow roots
 *
 * Normally, listening for focus with Shadow DOM will just return the top-most 'host' with a shadow
 * root. That may not be a problem! But if you want to find the 'real' focused element...
 *
 * To use this library, add this after the script is included-
 *   document.addEventListener('focus', shadowFocusHandler, true);
 *
 * You can then listen for `-shadow-focus` events, which will return the furthest focused element-
 *   document.addEventListener('-shadow-focus', function(ev) {
 *     console.info('got focused element', ev.detail, '..inside outer-most shadow root', ev.target);
 *   });
 */
var shadowFocusHandler = (function() {
  var eventName = '-shadow-focus';
  var dispatch = function(target) {
    var args = { composed: true, bubbles: true, detail: target };
    var customEvent = new CustomEvent(eventName, args);
    target.dispatchEvent(customEvent);
  };

  if (!window.WeakSet || !window.ShadowRoot) {
    return function(event) {
      dispatch(event.target);
    };
  }

  var focusHandlerSet = new WeakSet();

  /**
   * @param {Node} target to work on
   * @param {function(!FocusEvent)} callback to invoke on focus change
   */
  function _internal(target, callback) {
    var currentFocus = target; // save real focus

    // #1: get the nearest ShadowRoot
    while (!(target instanceof ShadowRoot)) {
      if (!target) {
        return;
      }
      target = target.parentNode;
    }

    // #2: are we already handling it?
    if (focusHandlerSet.has(target)) {
      return;
    }
    focusHandlerSet.add(target);

    // #3: setup focus/blur handlers
    var hostEl = target.host;
    var focusinHandler = function(ev) {
      if (ev.target !== currentFocus) {
        // prevent dup calls for same focus
        currentFocus = ev.target;
        callback(ev);
      }
    };
    var blurHandler = function(ev) {
      hostEl.removeEventListener('blur', blurHandler, false);
      target.removeEventListener('focusin', focusinHandler, true);
      focusHandlerSet.delete(target);
    };

    // #3: add blur handler to host element
    hostEl.addEventListener('blur', blurHandler, false);

    // #4: add focus handler within shadow root, to observe changes
    target.addEventListener('focusin', focusinHandler, true);

    // #5: find next parent SR, do it again
    _internal(target.host, callback);
  }

  /**
   * @param {!FocusEvent} event to process
   */
  function shadowFocusHandler(event) {
    var target =
      (event.composedPath ? event.composedPath()[0] : null) || event.target;
    _internal(target, shadowFocusHandler);
    dispatch(target);
  }

  return shadowFocusHandler;
})();

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

    var target =
      typeof e.composedPath === 'function'
        ? e.composedPath()[0]
        : document.activeElement;

    if (hadKeyboardEvent || focusTriggersKeyboardModality(target)) {
      target.addEventListener('blur', onBlur, true);
      addFocusRingClass(target);
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

    var target =
      typeof e.composedPath === 'function'
        ? e.composedPath()[0]
        : document.activeElement;

    target.removeEventListener('blur', onBlur, true);
    removeFocusRingClass(target);
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
  document.addEventListener('focus', shadowFocusHandler, true);
  document.addEventListener('-shadow-focus', onFocus, true);
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
