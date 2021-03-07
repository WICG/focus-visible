const rgb2hex = require('rgb2hex');

const {
  fixture,
  matchesKeyboard,
  matchesMouse,
  FOCUS_RING_STYLE,
  GET_OUTLINE_COLOR
} = require('./helpers');

describe('keydown should always update focus-visible', () => {
  beforeEach(() => fixture('tabindex-zero.html'));

  it('should apply .focus-visible to the activeElement if a key is pressed', () => {
    $('body').click();

    const el = $('#el');
    el.click();
    el.addValue('Shift');

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  });
});
