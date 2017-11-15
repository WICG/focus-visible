const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="range">', function() {
  beforeEach(function() {
    // Range inputs are super weird. Probably need to explore styling
    // the internal pseudo elements.
    // https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/
    return fixture('input-range.html');
  });

  it('should apply .focus-ring on keyboard focus', function() {
    return matchesKeyboard();
  });

  it('should NOT apply .focus-ring on mouse focus', function() {
    return matchesMouse(false);
  });
});
