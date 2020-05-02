const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="number">', () => {
  beforeEach(() => fixture('input-number.html'));

  it('should apply .focus-visible on keyboard focus', () => {
    return matchesKeyboard();
  });

  it('should apply .focus-visible on mouse focus', () => {
    return matchesMouse();
  });
});
