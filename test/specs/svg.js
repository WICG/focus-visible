const rgb2hex = require('rgb2hex');

const { fixture, FOCUS_RING_STYLE, GET_OUTLINE_COLOR } = require('./helpers');

// IE11 has a strange behavior where it will always focus an <svg> on the page.
// This test is to verify that we don't hit an error in this situation.
// See https://github.com/WICG/focus-visible/issues/80#issuecomment-383424156.
describe('svg focus', () => {
  beforeEach(() => fixture('svg.html'));

  it('should NOT apply .focus-visible if a non-interactive SVG is keyboard focused', () => {
    const body = $('body');
    body.click();

    // Tabs through the document until it reaches the last element.
    // In IE11 the non-interactive SVG, #icon will be focused.
    // If it throws, then the test will fail.
    browser.waitUntil(() => {
      const activeId = browser.execute(function() {
        return document.activeElement.id;
      });

      if (activeId) {
        if (activeId === 'end') {
          return true;
        }

        // Only IE11 will stop here and focus the #icon element.
        // If the element has focus, assert that :focus-visible has not been
        // applied to it.
        if (activeId === 'icon') {
          const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#end'));
          expect(color.hex).not.toBe(FOCUS_RING_STYLE);
        }

        // Move focus to the next element.
        // IE11's selenium browser won't move focus if we send it to body again
        // so we need to send it to the activeElement.
        $(`#${activeId}`).keys('Tab');
      } else {
        // Work around IE11 weirdness which sends focus to <html> first.
        body.addValue('Tab');
      }
    });

    const color = rgb2hex(browser.execute(GET_OUTLINE_COLOR, '#end'));
    expect(color.hex).toBe(FOCUS_RING_STYLE);
  });
});
