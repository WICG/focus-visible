const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<select size="3">', () => {
  beforeEach(() => fixture('select-size.html'));

  it('should apply .focus-visible on keyboard focus', () => {
    return matchesKeyboard();
  });

  it('should NOT apply .focus-visible on mouse focus', () => {
    return matchesMouse(false);
  });
});
