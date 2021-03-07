const rgb2hex = require('rgb2hex');

const {
  fixture,
  matchesKeyboard,
  matchesMouse,
  FOCUS_RING_STYLE,
  GET_OUTLINE_COLOR
} = require('./helpers');

describe('<div contenteditable>', () => {
  beforeEach(() => fixture('contenteditable.html'));

  // FF won't focus a div with contenteditable if it's the first element on the page.
  // So we click on a dummy element to move focus into the document.
  it('should apply .focus-visible on keyboard focus', () => {
    const start = $('#start');
    start.click();
    start.addValue('Tab');

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#el'));
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  });

  it('should apply .focus-visible on mouse focus', () => {
    return matchesMouse();
  });
});
