const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="time">', () => {
  beforeEach(() => fixture('input-time.html'));

  it('should apply .focus-visible on keyboard focus', () => {
    return matchesKeyboard();
  });

  it('should apply .focus-visible on mouse focus', function() {
    // Skip test in Microsoft Edge. It displays a modal UI on mouse click.
    if (browser.capabilities.browserName === 'microsoftedge') {
      return this.skip();
    }

    return matchesMouse();
  });
});
