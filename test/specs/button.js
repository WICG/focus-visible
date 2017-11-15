const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<button>', function() {
  beforeEach(function() {
    return fixture('button.html');
  });

  it('should apply .focus-ring on keyboard focus', function() {
    return matchesKeyboard();
  });

  it('should NOT apply .focus-ring on mouse focus', function() {
    return matchesMouse(false);
  });
});
