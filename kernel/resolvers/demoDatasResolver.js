const fs = require('fs');
require('module-alias/register');
const path = require('path');

/**
 * Class to get import needed files for the given locale
 * @class
 */
class DemoDatasResolver {
  /**
   * @constructs
   * Creating a resolver
   *
   * @param {string} locale Locale
   */
  constructor(locale) {
    this.version = locale;
  }

  /**
   * Get file path to require
   *
   * @param {string} selector Base path of the file to import
   * @return {string} Final path of the file to import
   */
  getFilePath(selector) {
    const basePath = path.resolve(__dirname, '../..');

    if (!fs.existsSync(`${basePath}/datas/${this.locale}/${selector}`)) {
      return `${basePath}/datas/${selector}`;
    }

    return `${basePath}/datas/${this.locale}/${selector}`;
  }

  /**
   * Get file path and require it
   *
   * @param {string} selector Base path of the file to import
   * @return {Module} Object of the path given
   */
  require(selector) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(
      this.getFilePath(selector),
    );
  }
}

module.exports = DemoDatasResolver;
