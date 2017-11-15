const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="text">', function() {
  beforeEach(function() {
    return fixture('input-text.html');
  });

  it('should apply .focus-ring on keyboard focus', function() {
    return matchesKeyboard();
  });

  it('should apply .focus-ring on mouse focus', function() {
    return matchesMouse();
  });
});
