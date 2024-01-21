const i18n = require('i18n');
const CommonPage = require('../../commonPage');

/**
 * FO parent page, contains functions that can be used in every FO page
 * @class
 * @extends CommonPage
 */
class FOBasePage extends CommonPage {
  /**
   * @constructs
   * Setting up Selectors to use on all BO pages
   */
  constructor() {
    super();

    // Selectors
    // Header
    this.contactLink = '#contact-link a';
    // Menu
    this.desktopTopMenu = '#_desktop_top_menu';
    this.desktopTopMenuClothesLink = `${this.desktopTopMenu} #category-3`;
  }

  /*
  Methods
   */
  async navigate(page, link) {
    await this.clickAndWaitForNavigation(page, link);
  }
}

module.exports = FOBasePage;
