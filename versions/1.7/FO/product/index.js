const i18n = require('i18n');
const FOBasePage = require('../FObasePage.js');

/**
 * FO product page
 * @class
 * @extends FOBasePage
 */
class Product extends FOBasePage {
  /**
   * @constructs
   * Creating page
   */
  constructor() {
    super();

    this.pageTitle = i18n.__('Hummingbird printed t-shirt');
  }
}

module.exports = new Product();
