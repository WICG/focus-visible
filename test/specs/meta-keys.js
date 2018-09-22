const { fixture, FOCUS_RING_STYLE } = require('./helpers');
const { Key, By } = require('selenium-webdriver');
const expect = require('expect');
const driver = global.__driver;

describe('meta keys', function() {
  beforeEach(function() {
    return fixture('button.html');
  });

  let el;
  beforeEach(async function() {
    el = await driver.findElement(By.css('#el'));
  });

  it('should NOT apply .focus-visible if the ctrl key is pressed', async function() {
    await el.click();
    // Simulates "ctrl - b".
    // Key.NULL tells selenium to clear the pressed state for the modifier key.
    await el.sendKeys(Key.CONTROL, 'b', Key.NULL);
    let actual = await driver.executeScript(`
      return window.getComputedStyle(document.querySelector('#el')).outlineColor
    `);
    expect(actual).toNotEqual(FOCUS_RING_STYLE);
  });

  it('should NOT apply .focus-visible if the meta key is pressed', async function() {
    await el.click();
    await el.sendKeys(Key.META, 'b', Key.NULL);
    let actual = await driver.executeScript(`
      return window.getComputedStyle(document.querySelector('#el')).outlineColor
    `);
    expect(actual).toNotEqual(FOCUS_RING_STYLE);
  });

  it('should NOT apply .focus-visible if the option/alt key is pressed', async function() {
    await el.click();
    await el.sendKeys(Key.ALT, 'b', Key.NULL);
    let actual = await driver.executeScript(`
      return window.getComputedStyle(document.querySelector('#el')).outlineColor
    `);
    expect(actual).toNotEqual(FOCUS_RING_STYLE);
  });
});
