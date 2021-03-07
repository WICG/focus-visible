const rgb2hex = require('rgb2hex');

const {
  fixture,
  matchesKeyboard,
  matchesMouse,
  FOCUS_RING_STYLE,
  GET_OUTLINE_COLOR
} = require('./helpers');

describe('using a pointing device to click an element after being in keyboard modality', () => {
  beforeEach(() => fixture('pointer-turns-off-keyboard.html'));

  it('should NOT apply .focus-visible if a pointer is used after a keyboard press on an already focused element', () => {
    const body = $('body');
    const el = $('#el');
    const other = $('#other');

    body.click();
    body.keys('Tab');
    body.keys('Tab');

    // Because the element is already focused, we don't get a focus event here
    // but we _do_ get a keydown event. Normally we clear the hadKeyboardEvent
    // flag after the focus event is handled, but since there wasn't one, we
    // still think we're in keyboard modality.
    other.keys(' ');

    // Using a pointing device should force keyboard modality off.
    el.click();

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  });
});
