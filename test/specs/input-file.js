const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="file">', () => {
  beforeEach(() => fixture('input-file.html'));

  it('should apply .focus-visible on keyboard focus', function() {
    if (browser.capabilities.browserName === 'firefox') {
      return this.skip();
    }

    return matchesKeyboard();
  });

  // fails to click on file elements
  it.skip('should NOT apply .focus-visible on mouse focus', function() {
    return matchesMouse(false);
  });
});
