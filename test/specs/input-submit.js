const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('<input type="submit">', () => {
  beforeEach(() => fixture('input-submit.html'));

  it('should apply .focus-visible on keyboard focus', () => {
    return matchesKeyboard();
  });

  it('should NOT apply .focus-visible on mouse focus', () => {
    return matchesMouse(false);
  });
});
