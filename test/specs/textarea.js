const {fixture, matchesKeyboard, matchesMouse} = require('./helpers');

describe('<textarea>', function() {
  beforeEach(function() {
    return fixture('textarea.html');
  });

  it('should apply .focus-ring on keyboard focus', function() {
    return matchesKeyboard();
  });

  it('should apply .focus-ring on mouse focus', function() {
    return matchesMouse();
  });
});
