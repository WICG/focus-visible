const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<button>', () => {
  beforeEach(() => fixture('button.html'));

  it('should apply .focus-visible on keyboard focus', () => {
    return matchesKeyboard();
  });

  it('should NOT apply .focus-visible on mouse focus', () => {
    return matchesMouse(false);
  });
});
