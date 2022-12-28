const rgb2hex = require('rgb2hex');

const {
  fixture,
  matchesKeyboard,
  matchesMouse,
  FOCUS_RING_STYLE,
  GET_OUTLINE_COLOR
} = require('./helpers');

describe('programmatic focus occurring after a microtask', () => {
  beforeEach(() => fixture('programmatic-focus-microtask.html'));

  it('should apply .focus-visible if a keyboard press calls focus()', () => {
    const body = $('body');
    const start = $('#start');
    body.click();
    body.addValue('Tab');
    start.addValue(' ');
    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  });

  it('should NOT apply .focus-visible if a mouse press calls focus()', () => {
    const body = $('body');
    const start = $('#start');
    start.click();
    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  });
});
