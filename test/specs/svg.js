const { fixture, FOCUS_RING_STYLE } = require('./helpers');
const { Key, By } = require('selenium-webdriver');
const expect = require('expect');
const driver = global.__driver;

// IE11 has a strange behavior where it will always focus an <svg> on the page.
// This test is to verify that we don't hit an error in this situation.
// See https://github.com/WICG/focus-visible/issues/80#issuecomment-383424156.
describe('svg focus', function() {
  beforeEach(function() {
    return fixture('svg.html');
  });

  it('should NOT apply .focus-visible if a non-interactive SVG is keyboard focused', async function() {
    async function tabUntil(body, end) {
      let el;
      while (true) {
        focused = await driver.executeScript(`
          return document.activeElement.id
        `);
        if (focused === end) {
          break;
        }
        if (focused) {
          // IE11's selenium driver won't move focus if we send it to body again
          // so we need to send it to the activeElement.
          el = await driver.findElement(By.css(`#${focused}`));
          await el.sendKeys(Key.TAB);
        } else {
          // Work around IE11 weirdness which sends focus to <html> first.
          await body.sendKeys(Key.TAB);
        }
      }
    }

    let body = await driver.findElement(By.css('body'));
    await body.click();
    await tabUntil(body, 'end');
    let actual = await driver.executeScript(`
      return window.getComputedStyle(document.querySelector('#end')).outlineColor
    `);
    expect(actual).toEqual(FOCUS_RING_STYLE);
  });
});
