const i18n = require('i18n');
const BOBasePage = require('../BObasePage.js');

/**
 * BO dashboard page
 * @class
 * @extends BOBasePage
 */
class Dashboard extends BOBasePage {
  /**
   * @constructs
   * Creating dashboard page
   */
  constructor() {
    super();

    this.pageTitle = i18n.__('Dashboard') + ' • ';
  }

  /*
  Methods
   */
}

module.exports = new Dashboard();
