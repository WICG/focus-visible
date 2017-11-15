const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="time">', function() {
  beforeEach(function() {
    return fixture('input-time.html');
  });

  it('should apply .focus-ring on keyboard focus', function() {
    return matchesKeyboard();
  });

  it('should apply .focus-ring on mouse focus', function() {
    return matchesMouse();
  });
});
