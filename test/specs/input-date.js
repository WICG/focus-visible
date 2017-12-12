const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="date">', function() {
  beforeEach(function() {
    return fixture('input-date.html');
  });

  it('should apply .focus-visible on keyboard focus', function() {
    return matchesKeyboard();
  });

  it('should apply .focus-visible on mouse focus', function() {
    return matchesMouse();
  });
});
