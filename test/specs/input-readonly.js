const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="text" readonly>', function() {
  beforeEach(function() {
    return fixture('input-readonly.html');
  });

  it('should NOT apply .focus-visible on keyboard focus', function() {
    return matchesKeyboard(false);
  });

  it('should NOT apply .focus-visible on mouse focus', function() {
    return matchesMouse(false);
  });
});
