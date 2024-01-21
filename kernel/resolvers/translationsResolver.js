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
   * @param {string} patchVersion Version
   * @param {string} locale Locale
   */
  constructor(patchVersion, locale) {
    this.patchVersion = patchVersion;
    if (this.patchVersion.length === 7) {
      this.minorVersion = this.patchVersion.slice(0, 5);
      if (this.minorVersion.includes('1.7')) {
        this.majorVersion = '1.7';
      } else {
        this.majorVersion = this.minorVersion.slice(0, 1);
      }
    } else if (this.patchVersion.length === 5) {
      this.minorVersion = this.patchVersion.slice(0, 3);
      if (this.minorVersion.includes('1.7')) {
        this.majorVersion = '1.7';
      } else {
        this.majorVersion = this.minorVersion.slice(0, 1);
      }
    } else {
      throw new Error(`Error with version '${this.patchVersion}'`);
    }
    this.locale = locale;
  }

  getCatalog() {
    const basePath = path.resolve(__dirname, '../..');

    let defaultCatalog = '{}';
    let patchCatalog = '{}';
    let minorCatalog = '{}';
    let majorCatalog = '{}';
    let mergedCatalog;

    if (fs.existsSync(`${basePath}/translations/${this.locale}.json`)) {
      defaultCatalog = require(`${basePath}/translations/${this.locale}.json`);
    }

    if (fs.existsSync(`${basePath}/translations/${this.majorVersion}/${this.locale}.json`)) {
      majorCatalog = require(`${basePath}/translations/${this.majorVersion}/${this.locale}.json`);
    }

    if (fs.existsSync(`${basePath}/translations/${this.minorVersion}/${this.locale}.json`)) {
      minorCatalog = require(`${basePath}/translations/${this.minorVersion}/${this.locale}.json`);
    }

    if (fs.existsSync(`${basePath}/translations/${this.patchVersion}/${this.locale}.json`)) {
      patchCatalog = require(`${basePath}/translations/${this.patchVersion}/${this.locale}.json`);
    }

    mergedCatalog = {
      ...defaultCatalog,
      ...majorCatalog,
      ...minorCatalog,
      ...patchCatalog,
    };

    return mergedCatalog;
  }
}

module.exports = TranslationsResolver;
