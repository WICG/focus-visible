const {
  FOCUS_RING_STYLE,
  fixture,
  matchesKeyboard,
  matchesMouse,
  shadowDescendantMatchesKeyboard,
  shadowDescendantMatchesMouse
} = require('./helpers');

describe('ShadowDOM', () => {
  beforeEach(() => fixture('shadow-dom.html'));

  it('should apply .focus-visible on keyboard focus', function() {
    // fails on Firefox in Sauce for unknown reasons
    if (
      browser.options.user &&
      browser.capabilities.browserName === 'firefox'
    ) {
      return this.skip();
    }
    return matchesKeyboard();
  });

  it('should NOT apply .focus-visible on mouse focus', () => {
    return matchesMouse(false);
  });

  describe('focusable elements in shadow', () => {
    it('should apply .focus-visible on keyboard focus', function() {
      // fails on Firefox in Sauce for unknown reasons
      if (
        browser.options.user &&
        browser.capabilities.browserName === 'firefox'
      ) {
        return this.skip();
      }
      return shadowDescendantMatchesKeyboard();
    });

    it('should NOT apply .focus-visible on mouse focus', () => {
      return shadowDescendantMatchesMouse(false);
    });
  });
});
