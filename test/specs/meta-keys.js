const rgb2hex = require('rgb2hex');

const { fixture, FOCUS_RING_STYLE, GET_OUTLINE_COLOR } = require('./helpers');

describe('meta keys', () => {
  before(function() {
    // Skip these tests in Edge and IE because it's unclear how to get focus
    // back to the page when pressing the Windows meta key without clicking
    // on the page which would sort of negate the test.
    if (
      browser.capabilities.browserName === 'microsoftedge' ||
      browser.capabilities.browserName === 'Internet Explorer'
    ) {
      return this.skip();
    }
  });

  beforeEach(() => fixture('button.html'));

  let el;
  beforeEach(() => {
    el = $('#el');
  });

  it('should NOT apply .focus-visible if the ctrl key is pressed', () => {
    el.click();
    // Simulates "ctrl - b".
    // Key.NULL tells selenium to clear the pressed state for the modifier key.
    el.addValue(['Control', 'b', null]);

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  });

  it('should NOT apply .focus-visible if the meta key is pressed', () => {
    el.click();
    el.addValue(['Meta', 'b', null]);

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  });

  it('should NOT apply .focus-visible if the option/alt key is pressed', () => {
    el.click();
    el.addValue(['Alt', 'b', null]);

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  });
});
