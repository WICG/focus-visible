const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="range">', () => {
  // Range inputs are super weird. Probably need to explore styling
  // the internal pseudo elements.
  // https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/
  beforeEach(() => fixture('input-range.html'));

  it('should apply .focus-visible on keyboard focus', () => {
    return matchesKeyboard();
  });

  it('should NOT apply .focus-visible on mouse focus', function() {
    // Skip test in Microsoft Edge. It displays a modal UI on mouse click.
    if (browser.capabilities.browserName === 'microsoftedge') {
      return this.skip();
    }

    return matchesMouse(false);
  });
});
