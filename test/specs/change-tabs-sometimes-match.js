const rgb2hex = require('rgb2hex');

const {
  fixture,
  matchesKeyboard,
  matchesMouse,
  FOCUS_RING_STYLE,
  GET_OUTLINE_COLOR
} = require('./helpers');

describe('change tabs, only match if elements had focus-visible', () => {
  // Note: For focus to enter the page properly with this fixture I had
  // to make sure the div had some width/height.
  // This seems like a geckodriver bug.
  beforeEach(() => fixture('change-tabs-sometimes-match.html'));

  it('should retain .focus-visible if the user switches tabs and an element had .focus-visible from keyboard', () => {
    let body = $('body');
    let el = $('#el');
    body.click();
    browser.keys('Tab');
    el.addValue(' ');
    browser.pause(4000); // sleep while we open and close a new tab.

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  });

  it('should NOT retain .focus-visible if the user switches tabs and an element did not have .focus-visible because it was mouse focused', () => {
    let el = $('#el');
    el.click();
    driver.pause(4000);

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).not.toBe(FOCUS_RING_STYLE);
  });
});
