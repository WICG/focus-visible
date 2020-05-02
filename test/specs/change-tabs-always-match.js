const rgb2hex = require('rgb2hex');

const {
  fixture,
  matchesKeyboard,
  matchesMouse,
  FOCUS_RING_STYLE,
  GET_OUTLINE_COLOR
} = require('./helpers');

describe('change tabs, always match if elements should always have focus-visible', () => {
  beforeEach(() => fixture('change-tabs-always-match.html'));

  it('should retain .focus-visible if the user switches tabs and an element had .focus-visible from keyboard', () => {
    const body = $('body');
    const el = $('#el');
    body.click();
    browser.keys('Tab');
    el.addValue(' ');
    browser.pause(4000);

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  });

  it('should retain .focus-visible if the user switches tabs and an element had .focus-visible from mouse', () => {
    const el = $('#el');
    el.click();
    browser.pause(4000);

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  });
});
