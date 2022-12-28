const rgb2hex = require('rgb2hex');

const {
  fixture,
  matchesKeyboard,
  matchesMouse,
  FOCUS_RING_STYLE,
  GET_OUTLINE_COLOR
} = require('./helpers');

describe('<input type="radio"> group', () => {
  beforeEach(() => fixture('input-radio-group.html'));

  it('should apply .focus-visible on keyboard focus', () => {
    const first = $('#first');
    first.click();
    first.addValue('ArrowDown');

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#last'));
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  });

  it('should NOT apply .focus-visible on mouse focus', () => {
    $('#first').click();

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#first'));
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  });
});
