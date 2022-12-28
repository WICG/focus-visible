const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="text">', () => {
  beforeEach(() => fixture('input-text.html'));

  it('should apply .focus-visible on keyboard focus', () => {
    return matchesKeyboard();
  });

  it('should apply .focus-visible on mouse focus', () => {
    return matchesMouse();
  });
});
