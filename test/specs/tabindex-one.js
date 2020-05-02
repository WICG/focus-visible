const { fixture, matchesKeyboard, matchesMouse } = require('./helpers');

describe('[tabindex=1]', () => {
  // Note: For focus to enter the page properly with this fixture I had
  // to make sure the div had some width/height.
  // This seems like a geckodriver bug.
  beforeEach(() => fixture('tabindex-one.html'));

  it('should apply .focus-visible on keyboard focus', () => {
    return matchesKeyboard();
  });

  it('should NOT apply .focus-visible on mouse focus', () => {
    return matchesMouse(false);
  });
});
