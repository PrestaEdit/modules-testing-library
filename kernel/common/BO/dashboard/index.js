require('module-alias/register');
const BOBasePage = require('../BObasePage');

class Dashboard extends BOBasePage {
  constructor() {
    super();

    this.pageTitle = 'Dashboard • ';
  }

  /*
  Methods
   */
}

module.exports = new Dashboard();
