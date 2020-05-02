const rgb2hex = require('rgb2hex');

// Expected test results
const FOCUS_RING_STYLE = '#ff0000';
// Receive outline color helper
const GET_OUTLINE_COLOR = function(selector) {
  return window.getComputedStyle(document.querySelector(selector)).outlineColor;
};
const GET_SHADOW_ELEMENT = function(root, selector) {
  return document.querySelector(root).shadowRoot.querySelector(selector);
};
const GET_SHADOW_OUTLINE_COLOR = function(root, selector) {
  var el = document.querySelector(root);
  return window.getComputedStyle(el.shadowRoot.querySelector(selector))
    .outlineColor;
};

/**
 * Load a test fixture HTML file to run assertions against.
 * @param {*} file
 */
function fixture(file) {
  browser.url(`http://localhost:8080/${file}`);
  $('body').click();
}

/**
 * Assert that the target element with the #el id responds to keyboard focus.
 * Can optionally take a `false` argument to indicate it should NOT match.
 * @param {*} shouldMatch
 */
function matchesKeyboard(shouldMatch = true) {
  browser.keys('Tab');

  color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));

  if (shouldMatch) {
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  } else {
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  }
}

/**
 * Assert that the target element with the #el id responds to mouse focus.
 * Can optionally take a `false` argument to indicate it should NOT match.
 * @param {*} shouldMatch
 */
function matchesMouse(shouldMatch = true) {
  $('#el').click();

  const color = browser.execute(GET_OUTLINE_COLOR, '#el');
  // IE returns "transparent" instead of and rgba value
  const { hex } = rgb2hex(color === 'transparent' ? 'rgba(0, 0, 0, 0)' : color);

  if (shouldMatch) {
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  } else {
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  }
}

function shadowDescendantMatchesKeyboard(shouldMatch = true) {
  $('body').addValue('Tab');

  color = rgb2hex(
    browser.execute(GET_SHADOW_OUTLINE_COLOR, '#el', '#shadow-el')
  );

  if (shouldMatch) {
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  } else {
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  }
}

function shadowDescendantMatchesMouse(shouldMatch = true) {
  const element = $(browser.execute(GET_SHADOW_ELEMENT, '#el', '#shadow-el'));
  element.click();

  color = rgb2hex(
    browser.execute(GET_SHADOW_OUTLINE_COLOR, '#el', '#shadow-el')
  );

  if (shouldMatch) {
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  } else {
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  }
}

module.exports = {
  FOCUS_RING_STYLE,
  GET_OUTLINE_COLOR,
  fixture,
  matchesKeyboard,
  matchesMouse,
  shadowDescendantMatchesKeyboard,
  shadowDescendantMatchesMouse
};
