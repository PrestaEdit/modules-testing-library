const i18n = require('i18n');
const FOBasePage = require('../FObasePage.js');

/**
 * FO contact page
 * @class
 * @extends FOBasePage
 */
class Contact extends FOBasePage {
  /**
   * @constructs
   * Creating page
   */
  constructor() {
    super();

    this.pageTitle = i18n.__('Contact us');
  }
}

module.exports = new Contact();
