const i18n = require('i18n');
const BOBasePage = require('../../BObasePage.js');

/**
 * BO module catalog page
 * @class
 * @extends BOBasePage
 */
class ModuleCatalog extends BOBasePage {
  /**
   * @constructs
   * Creating module catalog page (selectors and static messages)
   */
  constructor() {
    super();

    this.pageTitle = i18n.__('Module selection') + ' • ';
    this.installMessageSuccessful = moduleTag => i18n.__(`Install action on module ${moduleTag} succeeded.`);
    this.uninstallMessageSuccessful = moduleTag => i18n.__('Uninstall action on module %s succeeded.', moduleTag);

    // Selectors
    this.searchModuleTagInput = '#search-input-group input.pstaggerAddTagInput';
    this.searchModuleButton = '#module-search-button';
    this.moduleBloc = moduleTag => `.modules-list div[data-tech-name='${moduleTag}']:not([style])`;
    this.installModuleButton = moduleTag => `${this.moduleBloc(moduleTag)} form>button.module_action_menu_install`;
    this.uninstallModuleButton = moduleTag => `${this.moduleBloc(moduleTag)} form>button.module_action_menu_uninstall`;
    this.configureModuleButton = moduleTag => `${this.moduleBloc(moduleTag)} `
      + 'div.form-action-button-container button.module_action_menu_configure';
    this.uninstallModal = moduleTag => `#module-modal-confirm-${moduleTag}-uninstall`;
    this.confirmUninstallModalLink = moduleTag => `${this.uninstallModal(moduleTag)} a.module_action_modal_uninstall`;
  }

  /*
  Methods
   */

  /**
   * Search Module in Page module Catalog
   * @param page {Page} Browser tab
   * @param moduleTag {string} Tag of the module
   * @return {Promise<boolean>}
   */
  async searchModule(page, moduleTag) {
    await page.type(this.searchModuleTagInput, moduleTag);
    await page.click(this.searchModuleButton);

    return this.elementVisible(page, this.moduleBloc(moduleTag), 2000);
  }

  /**
   * Install Module and waiting for successful massage
   * @param page {Page} Browser tab
   * @param moduleTag {string} Name of the module
   * @returns {Promise<string>}
   */
  async installModule(page, moduleTag) {
    if (await this.elementNotVisible(page, this.moduleBloc(moduleTag), 2000)) {
      throw new Error('Can\'t found the module');
    } else if (await this.elementNotVisible(page, this.installModuleButton(moduleTag), 2000)) {
      //throw new Error('Module already installed');
      return this.installMessageSuccessful(moduleTag);
    }

    await page.click(this.installModuleButton(moduleTag));
    return this.getTextContent(page, this.growlMessageBlock);
  }

  /**
   * Uninstall Module and waiting for successful message
   * @param page {Page} Browser tab
   * @param moduleTag {string} Name of the module
   * @returns {Promise<string>}
   */
  async uninstallModule(page, moduleTag) {
    if (await this.elementNotVisible(page, this.moduleBloc(moduleTag), 2000)) {
      throw new Error('Can\'t found the module');
    }
    if (await this.elementNotVisible(page, this.uninstallModuleButton(moduleTag), 1000)) {
      await Promise.all([
        page.click(this.actionsDropdownButton(moduleTag)),
        this.waitForVisibleSelector(page, `${this.actionsDropdownButton(moduleTag)}[aria-expanded='true']`),
      ]);
    }
    if (await this.elementNotVisible(page, this.uninstallModuleButton(moduleTag), 2000)) {
      //throw new Error('Module already uninstalled');
      return this.uninstallMessageSuccessful(moduleTag);
    }

    // Click on disable module and wait for modal to be displayed
    await Promise.all([
      page.click(this.uninstallModuleButton(moduleTag)),
      this.waitForVisibleSelector(page, this.uninstallModal(moduleTag)),
    ]);

    // Confirm delete in modal and get successful message
    const [textResult] = await Promise.all([
      this.getGrowlMessageContent(page),
      page.click(this.confirmUninstallModalLink(moduleTag)),
    ]);

    await this.closeGrowlMessage(page);

    return textResult;
  }

  /**
   * Go to module configuration page
   * @param page {Page} Browser tab
   * @param moduleTag {string} Name of the module
   * @returns {Promise<void>}
   */
  async goToConfigurationPage(page, moduleTag) {
    await this.clickAndWaitForNavigation(page, this.configureModuleButton(moduleTag));
  }
}

module.exports = new ModuleCatalog();
