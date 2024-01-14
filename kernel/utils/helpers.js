require('./globals');

const fs = require('fs');
const playwright = require('playwright');
const {PNG} = require('pngjs');
const pixelmatch = require('pixelmatch');


module.exports = {
  /**
   * Create playwright browser
   *
   * @param {number} attempt number of attempts to restart browser creation if function throw error
   * @return {Promise<Browser>}
   */
  async createBrowser(attempt = 1) {
    try {
      const browserConfig = global.BROWSER.config;

      // Add argument for chromium (window size for headful debug and sandbox)
      if (global.BROWSER.name === 'chromium') {
        browserConfig.args = [
          `--window-size=${global.BROWSER.width}, ${global.BROWSER.height}`,
          `--lang=${global.BROWSER.lang}`,
        ];

        browserConfig.args = await (browserConfig.args).concat(global.BROWSER.sandboxArgs);
      }

      return (await playwright[global.BROWSER.name].launch(browserConfig));
    } catch (e) {
      if (attempt <= 3) {
        await (new Promise(resolve => setTimeout(resolve, 5000)));
        return this.createBrowser(attempt + 1);
      }
      throw new Error(e);
    }
  },

  /**
   * Create a browser context
   *
   * @param browser {Browser} Browser instance from playwright
   * @return {Promise<BrowserContext>}
   */
  async createBrowserContext(browser) {
    return browser.newContext(
      {
        acceptDownloads: global.BROWSER.acceptDownloads,
        locale: global.BROWSER.lang,
        viewport:
          {
            width: global.BROWSER.width,
            height: global.BROWSER.height,
          },
      },
    );
  },

  /**
   * Create new tab in browser
   *
   * @param context {BrowserContext} Browser context instance created
   * @return {Promise<Page>}
   */
  async newTab(context) {
    return context.newPage();
  },

  /**
   * Destroy browser instance, that delete as well all files downloaded
   *
   * @param context {BrowserContext} Browser context instance to close
   * @return {Promise<void>}
   */
  async closeBrowserContext(context) {
    return context.close();
  },

  /**
   * Destroy browser instance, that delete as well all files downloaded
   *
   * @param browser {Browser} Browser instance to close
   * @return {Promise<void>}
   */
  async closeBrowser(browser) {
    return browser.close();
  },

  /**
   * Make screenshot
   *
   * @param page {Page} Page instance
   * @return {Promise<Page>}
   */
  async capture(page, relatedPage, specific = '') {
    let screenIdentifier = await this.getScreenIdentifier(relatedPage);
    if (specific !== '') {
      screenIdentifier = screenIdentifier + '/' + specific;
    }
    const options = {path: 'screens/' + screenIdentifier + '/expected.png'};

    return page.screenshot(options);
  },
  async captureNow(page, relatedPage, specific = '') {
    let screenIdentifier = await this.getScreenIdentifier(relatedPage);
    if (specific !== '') {
      screenIdentifier = screenIdentifier + '/' + specific;
    }
    const options = {path: 'screens/' + screenIdentifier + '/actual.png'};

    await page.screenshot(options);

    return 'screens/' + screenIdentifier + '/actual.png';
  },
  async getScreenIdentifier(page) {
    return page.constructor.name.toLowerCase();
  },
  async visualComparison(page, relatedPage, specific = '') {
    if (global.REFRESH_SNAPSHOTS) {
      await this.capture(page, relatedPage, specific);
    }

    let screenIdentifier = await this.getScreenIdentifier(relatedPage);
    if (specific !== '') {
      screenIdentifier = screenIdentifier + '/' + specific;
    }

    const img1 = PNG.sync.read(fs.readFileSync('screens/' + screenIdentifier + '/expected.png'));
    const img2 = PNG.sync.read(fs.readFileSync(await this.captureNow(page, relatedPage, specific)));
    const {width, height} = img1;
    const diff = new PNG({width, height});

    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.2});

    fs.writeFileSync('screens/' + screenIdentifier + '/diff.png', PNG.sync.write(diff));

    return numDiffPixels > 0;
  },
};
