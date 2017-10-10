(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * Module export
 *
 * @param {Element} el
 * @return {ClassList}
 */

var domClasslist = function (el) {
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for the given element
 *
 * @param {Element} el DOM Element
 */
function ClassList(el) {
  if (!el || el.nodeType !== 1) {
    throw new Error('A DOM Element reference is required');
  }

  this.el = el;
  this.classList = el.classList;
}

/**
 * Check token validity
 *
 * @param token
 * @param [method]
 */
function checkToken(token, method) {
  method = method || 'a method';

  if (typeof token != 'string') {
    throw new TypeError(
      'Failed to execute \'' + method + '\' on \'ClassList\': ' +
      'the token provided (\'' + token + '\') is not a string.'
    );
  }
  if (token === "") {
    throw new SyntaxError(
      'Failed to execute \'' + method + '\' on \'ClassList\': ' +
      'the token provided must not be empty.'
    );
  }
  if (/\s/.test(token)) {
    throw new Error(
      'Failed to execute \'' + method + '\' on \'ClassList\': ' +
      'the token provided (\'' + token + '\') contains HTML space ' +
      'characters, which are not valid in tokens.'
    );
  }
}

/**
 * Return an array of the class names on the element.
 *
 * @return {Array}
 */
ClassList.prototype.toArray = function () {
  var str = (this.el.getAttribute('class') || '').replace(/^\s+|\s+$/g, '');
  var classes = str.split(/\s+/);
  if ('' === classes[0]) { classes.shift(); }
  return classes;
};

/**
 * Add the given `token` to the class list if it's not already present.
 *
 * @param {String} token
 */
ClassList.prototype.add = function (token) {
  var classes, index, updated;
  checkToken(token, 'add');

  if (this.classList) {
    this.classList.add(token);
  }
  else {
    // fallback
    classes = this.toArray();
    index = classes.indexOf(token);
    if (index === -1) {
      classes.push(token);
      this.el.setAttribute('class', classes.join(' '));
    }
  }

  return;
};

/**
 * Check if the given `token` is in the class list.
 *
 * @param {String} token
 * @return {Boolean}
 */
ClassList.prototype.contains = function (token) {
  checkToken(token, 'contains');

  return this.classList ?
    this.classList.contains(token) :
    this.toArray().indexOf(token) > -1;
};

/**
 * Remove any class names that match the given `token`, when present.
 *
 * @param {String|RegExp} token
 */
ClassList.prototype.remove = function (token) {
  var arr, classes, i, index, len;

  if ('[object RegExp]' == Object.prototype.toString.call(token)) {
    arr = this.toArray();
    for (i = 0, len = arr.length; i < len; i++) {
      if (token.test(arr[i])) {
        this.remove(arr[i]);
      }
    }
  }
  else {
    checkToken(token, 'remove');

    if (this.classList) {
      this.classList.remove(token);
    }
    else {
      // fallback
      classes = this.toArray();
      index = classes.indexOf(token);
      if (index > -1) {
        classes.splice(index, 1);
        this.el.setAttribute('class', classes.join(' '));
      }
    }
  }

  return;
};

/**
 * Toggle the `token` in the class list. Optionally force state via `force`.
 *
 * Native `classList` is not used as some browsers that support `classList` do
 * not support `force`. Avoiding `classList` altogether keeps this function
 * simple.
 *
 * @param {String} token
 * @param {Boolean} [force]
 * @return {Boolean}
 */
ClassList.prototype.toggle = function (token, force) {
  checkToken(token, 'toggle');

  var hasToken = this.contains(token);
  var method = hasToken ? (force !== true && 'remove') : (force !== false && 'add');

  if (method) {
    this[method](token);
  }

  return (typeof force == 'boolean' ? force : !hasToken);
};

// element-closest | CC0-1.0 | github.com/jonathantneal/closest

(function (ElementProto) {
	if (typeof ElementProto.matches !== 'function') {
		ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
			var element = this;
			var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
			var index = 0;

			while (elements[index] && elements[index] !== element) {
				++index;
			}

			return Boolean(elements[index]);
		};
	}

	if (typeof ElementProto.closest !== 'function') {
		ElementProto.closest = function closest(selector) {
			var element = this;

			while (element && element.nodeType === 1) {
				if (element.matches(selector)) {
					return element;
				}

				element = element.parentNode;
			}

			return null;
		};
	}
})(window.Element.prototype);

/**
 * https://github.com/WICG/focus-ring
 */
function init() {
  var hadKeyboardEvent = false;
  var elWithFocusRing;
  var elementsWithFocusRing = document.getElementsByClassName('focus-ring');

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

  // keys that often produce a change of context or focus
  var navigationKeys = [
    8 /* Backspace */,
    9 /* Tab */,
    13 /* Enter */,
    27 /* Esc */,
    32 /* Space */,
    33 /* PageUp */,
    34 /* PageDown */,
    35 /* End */,
    36 /* Home */,
    37 /* ArrowLeft */,
    38 /* ArrowUp */,
    39 /* ArrowRight */,
    40 /* ArrowDown */,
    46/* Delete */,
  ];

  var behavior = {
    incrementable: {
      inputType: {
        'checkbox': true,
        'radio': true,
        'range': true,
      },
      role: {
        'checkbox': true,
        'columnheading': true,
        'gridcell': true,
        'menuitem': true,
        'menuitemcheckbox': true,
        'menuitemradio': true,
        'option': true,
        'radio': true,
        'row': true,
        'rowheading': true,
        'slider': true,
        'tab': true,
        'treeitem': true,
      },
    },
    selectable: {
      inputType: {
        'checkbox': true,
        'radio': true,
      },
      role: {
        'checkbox': true,
        'columnheading': true,
        'gridcell': true,
        'menuitemcheckbox': true,
        'menuitemradio': true,
        'option': true,
        'radio': true,
        'row': true,
        'rowheading': true,
        'treeitem': true,
      },
    },
    deletable: {
      inputType: {
      },
      role: {
        'option': true,
        'row': true,
        'tab': true,
        'treeitem': true,
      },
    },
  };

  /**
   * Computes whether keyboard event should be treated as initiating focus navigation.
   * @param {Event} e
   * @return {boolean}
   */
  function handleEventAsNavigation(e) {
    if (e.altKey || e.ctrlKey || e.metaKey)
      return false;

    var index = navigationKeys.indexOf(e.keyCode);
    var tagName = e.target.tagName;
    var inputType = tagName === 'INPUT' ? e.target.type : undefined;
    var ariaRole = e.target.getAttribute('role');

    // If key is not generally considered navigation, don't handle it as such.
    if (index === -1)
      return false;

    // ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home/End, PageUp/PageDown
    if (e.keyCode > 32 && e.keyCode < 41)
      // Return true if target is an input or has a role and is whitelisted as 'incrementable'.
      return (inputType && behavior.incrementable.inputType[inputType])
        || (ariaRole && behavior.incrementable.role[ariaRole]);

    // Enter or Space
    if (e.keyCode == 13 || e.keyCode == 32)
      // Return true if target is an input or has a role and is whitelisted as 'selectable'.
      return (inputType && behavior.selectable.inputType[inputType])
        || (ariaRole && behavior.selectable.role[ariaRole]);

    // Esc key when target is a descendant of a dialog or menu.
    if (e.keyCode == 27)
      return event.target.closest('[role$="dialog"],[role="menu"]') !== null;

    // Backspace or Delete
    if (e.keyCode == 8 || e.keyCode == 46)
      // Return true if target has a role and is whitelisted as 'deletable'.
      return ariaRole && behavior.deletable.role[ariaRole];

    return e.keyCode == 9;
  }

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
    if (domClasslist(el).contains('focus-ring'))
      return;
    domClasslist(el).add('focus-ring');
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
    domClasslist(el).remove('focus-ring');
    el.removeAttribute('data-focus-ring-added');
  }

  /**
   * On `keydown`, set `hadKeyboardEvent`, add `focus-ring` class if the
   * key was Tab or another navigation key.
   * @param {Event} e
   */
  function onKeyDown(e) {
    if (!handleEventAsNavigation(e))
      return;

    hadKeyboardEvent = true;
  }

  /**
   * On `mousedown`, unset `hadKeyboardEvent`, remove `focus-ring` class from elements where not
   * originally added by the author.
   * @param {Event} e
   */
  function onMouseDown(e) {
    hadKeyboardEvent = false;
    if (elementsWithFocusRing.length) {
      for(var i = 0; i < elementsWithFocusRing.length; i++) {
        if (!focusTriggersKeyboardModality(elementsWithFocusRing[i])) {
          removeFocusRingClass(elementsWithFocusRing[i]);
        }
      }
    }
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
    if (domClasslist(document.activeElement).contains('focus-ring')) {
      // Keep a reference to the element to which the focus-ring class is applied
      // so the focus-ring class can be restored to it if the window regains
      // focus after being blurred.
      elWithFocusRing = document.activeElement;
    }
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mousedown', onMouseDown, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
  window.addEventListener('focus', onWindowFocus, true);
  window.addEventListener('blur', onWindowBlur, true);

  domClasslist(document.body).add('js-focus-ring');
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

})));
