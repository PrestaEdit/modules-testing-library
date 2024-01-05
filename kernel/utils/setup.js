const path = require('path');
const i18n = require('i18n');
/** @module helper */
const helper = require('./helpers');

/**
 * configure shared state
 */
i18n.configure({
  locales: ['en', 'fr'],
  defaultLocale: global.LOCALE,
  directory: path.join(__dirname, '../../translations'),
});

/**
 * @function
 *
 * @name before
 * @desc First mocha hook that run to create a unique browser to use for that run
 */
before(async function () {
  this.browser = await helper.createBrowser();
});

/**
 * @function
 *
 * @name after
 * @desc Last hook that run to close the browser created in the before function
 */
after(async function () {
  await helper.closeBrowser(this.browser);
});
