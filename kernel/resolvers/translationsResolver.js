const fs = require('fs');
require('module-alias/register');
const path = require('path');

/**
 * Class to get import needed files for the given locale
 * @class
 */
class TranslationsResolver {
  /**
   * @constructs
   * Creating a resolver
   *
   * @param {string} version Version
   * @param {string} locale Locale
   */
  constructor(version, locale) {
    this.version = version;
    this.locale = locale;
  }

  getCatalog() {
    const basePath = path.resolve(__dirname, '../..');

    let defaultCatalog = '{}';
    let specificCatalog = '{}';
    let mergedCatalog;

    if (fs.existsSync(`${basePath}/translations/${this.locale}.json`)) {
      defaultCatalog = require(`${basePath}/translations/${this.locale}.json`);
    }

    if (fs.existsSync(`${basePath}/translations/${this.version}/${this.locale}.json`)) {
      specificCatalog = require(`${basePath}/translations/${this.version}/${this.locale}.json`);
    }

    mergedCatalog = {
      ...defaultCatalog,
      ...specificCatalog,
    };

    return mergedCatalog;
  }
}

module.exports = TranslationsResolver;
