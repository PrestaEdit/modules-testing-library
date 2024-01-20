const i18n = require('i18n');
const path = require('path');
const TranslationsResolver = require('../resolvers/translationsResolver');
/** @module helper */
const helper = require('./helpers');

const translationsResolver = new TranslationsResolver(global.PS_VERSION, global.LOCALE);

/**
 * configure shared state
 */
i18n.configure({
  locales: ['en'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '../../translations'),
  logDebugFn: function(msg) {},
  logWarnFn: function(msg) {},
  logErrorFn: function(msg) {},
});

if (true) {
  i18n.configure({
    staticCatalog: {
      specific: translationsResolver.getCatalog(),
    },
    defaultLocale: 'specific',
  });
}

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
