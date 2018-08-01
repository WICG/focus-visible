const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="text" disabled>', function() {
  beforeEach(function() {
    return fixture('input-disabled.html');
  });

  it('should NOT apply .focus-visible on keyboard focus', function() {
    return matchesKeyboard(false);
  });

  // Clicking on a disabled element causes Selenium to throw an exception
  // in Firefox :(
  it.skip('should NOT apply .focus-visible on mouse focus', function() {
    return matchesMouse(false);
  });
});
