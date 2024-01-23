const i18n = require('i18n');
const FOBasePage = require('../FObasePage.js');

/**
 * FO categoy manager page
 * @class
 * @extends FOBasePage
 */
class Category extends FOBasePage {
  /**
   * @constructs
   * Creating page
   */
  constructor() {
    super();

    this.pageTitle = i18n.__('Clothes');

    // Products
    this.identifier = '#category';
    this.productsListing = `${this.identifier} #products`;
    this.productOnListing = `${this.productsListing} [data-id-product="1"]`;
  }
}

module.exports = new Category();
