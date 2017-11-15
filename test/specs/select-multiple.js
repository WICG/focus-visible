const {fixture, matchesKeyboard, matchesMouse} = require('./helpers');

describe('<select multiple>', function() {
  beforeEach(function() {
    return fixture('select-multiple.html');
  });

  it('should apply .focus-ring on keyboard focus', function() {
    return matchesKeyboard();
  });

  it('should NOT apply .focus-ring on mouse focus', function() {
    return matchesMouse(false);
  });
});
