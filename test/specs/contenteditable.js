const {fixture, matchesKeyboard, matchesMouse} = require('./helpers');

describe('<div contenteditable>', function() {
  beforeEach(function() {
    return fixture('contenteditable.html');
  });

  // This test seems to fail because FF won't focus a div with contenteditable
  // if it's the first element on the page. Weird.
  // https://jsbin.com/cawevo/edit?html,output
  it.skip('should apply .focus-ring on keyboard focus', function() {
    return matchesKeyboard();
  });

  it.skip('should apply .focus-ring on mouse focus', function() {
    return matchesMouse();
  });
});
