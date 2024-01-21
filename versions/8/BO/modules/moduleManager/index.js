const i18n = require('i18n');
const BOBasePage = require('../../BObasePage.js');

/**
 * BO module manager page
 * @class
 * @extends BOBasePage
 */
class ModuleManager extends BOBasePage {
  /**
   * @constructs
   * Creating module manager page (selectors and static messages)
   */
  constructor() {
    super();

    this.pageTitle = i18n.__('Module manager') + ' •';
    this.successfulEnableMessage = moduleTag => i18n.__('Enable action on module %s succeeded.', moduleTag);
    this.successfulDisableMessage = moduleTag => i18n.__('Disable action on module %s succeeded.', moduleTag);

    // Header selectors
    this.selectionSubTab = '#subtab-AdminModulesManage';

    // Selectors
    this.searchModuleTagInput = '#search-input-group input.pstaggerAddTagInput';
    this.searchModuleButton = '#module-search-button';
    this.modulesListBlock = '.module-short-list:not([style=\'display: none;\'])';
    this.allModulesBlock = `${this.modulesListBlock} .module-item-list`;
    this.moduleBlock = moduleTag => `${this.allModulesBlock}[data-tech-name='${moduleTag}']`;
    this.enableModuleButton = moduleTag => `${this.moduleBlock(moduleTag)} button.module_action_menu_enable`;
    this.configureModuleButton = moduleTag => `${this.moduleBlock(moduleTag)}`
      + ' div.module-actions a[href*=\'/action/configure\']';
    this.actionsDropdownButton = moduleTag => `${this.moduleBlock(moduleTag)} button.dropdown-toggle`;

    // Status dropdown selectors
    this.statusDropdownMenu = 'div.ps-dropdown-menu[aria-labelledby=\'module-status-dropdown\']';
    this.statusDropdownItemLink = ref => `${this.statusDropdownMenu} ul li[data-status-ref='${ref}'] a`;

    // Categories selectors
    this.categoriesSelectDiv = '#categories';
    this.categoriesDropdownDiv = 'div.ps-dropdown-menu.dropdown-menu.module-category-selector';
    this.categoryDropdownItem = cat => `${this.categoriesDropdownDiv} li[data-category-display-name='${cat}']`;

    // Upload selectors
    this.uploadModuleButton = '#page-header-desc-configuration-add_module';
    this.uploadModuleModal = '#module-modal-import';
    this.uploadModuleModalCloseButton = '#module-modal-import-closing-cross';
    this.importDropZone = '#importDropzone';
    this.uploadModuleModalFileInput = `${this.importDropZone} input`;
    this.uploadModuleModalProcessing = `${this.importDropZone} > div.module-import-processing`;
    this.uploadModuleModalSuccess = `${this.importDropZone} > div.module-import-success`;

    // Disable selectors
    this.disableModuleButton = moduleTag => `${this.moduleBlock(moduleTag)} button.module_action_menu_disable`;
    this.disableModal = moduleTag => `#module-modal-confirm-${moduleTag}-disable`;
    this.confirmDisableModalLink = moduleTag => `${this.disableModal(moduleTag)} a.module_action_modal_disable`;
  }

  /*
  Methods
   */

  /**
   * Search Module in Page module Catalog
   * @param page {Page} Browser tab
   * @param moduleTag {string} Tag of the module
   * @return {Promise<void>}
   */
  async searchModule(page, moduleTag) {
    await page.type(this.searchModuleTagInput, moduleTag);
    await page.click(this.searchModuleButton);
    return this.elementVisible(page, this.moduleBlock(moduleTag), 10000);
  }

  /**
   * Go to selection subTab
   * @param page {Page} Browser tab
   * @return {Promise<void>}
   */
  async goToSelectionPage(page) {
    await this.clickAndWaitForNavigation(page, this.selectionSubTab);
  }

  /**
   * Click on button configure of a module
   * @param page {Page} Browser tab
   * @param moduleTag {string} Name of the module
   * @return {Promise<void>}
   */
  async goToConfigurationPage(page, moduleTag) {
    if (await this.elementNotVisible(page, this.configureModuleButton(moduleTag), 1000)) {
      await Promise.all([
        page.click(this.actionsDropdownButton(moduleTag)),
        this.waitForVisibleSelector(page, `${this.actionsDropdownButton(moduleTag)}[aria-expanded='true']`),
      ]);
    }
    await this.clickAndWaitForNavigation(page, this.configureModuleButton(moduleTag));
  }

  /**
   * Get status of module (enable/disable)
   * @param page {Page} Browser tab
   * @param moduleTag {string} Name of the module
   * @return {Promise<boolean>}
   */
  isModuleEnabled(page, moduleTag) {
    return this.elementNotVisible(page, this.enableModuleButton(moduleTag), 1000);
  }

  /**
   * Upload a module and returns a success or failure
   * @param page {Page} Browser tab
   * @param filePath {string} Module file path
   * @returns {Promise<boolean>}
   */
  async uploadModule(page, filePath) {
    await page.click(this.uploadModuleButton);
    await this.waitForVisibleSelector(page, this.uploadModuleModal);

    const handle = await page.$(this.uploadModuleModalFileInput);
    await handle.setInputFiles(filePath);

    await page.waitForSelector(this.uploadModuleModalProcessing, {state: 'hidden'});

    return this.elementVisible(page, this.uploadModuleModalSuccess, 2000);
  }

  /**
   * Close upload module modal
   * @param page {Page} Browser tab
   * @return {Promise<void>}
   */
  async closeUploadModuleModal(page) {
    await page.click(this.uploadModuleModalCloseButton);
    await page.waitForSelector(this.uploadModuleModalCloseButton, {state: 'hidden'});
  }

  /**
   * Disable module
   * @param page {Page} Browser tab
   * @param moduleTag {string} Tag of the module
   * @return {Promise<string>}
   */
  async disableModule(page, moduleTag) {
    // Open dropdown if disable button is not displayed as first button
    if (await this.elementNotVisible(page, this.disableModuleButton(moduleTag), 1000)) {
      await page.click(this.actionsDropdownButton(moduleTag));
    }

    // Click on disable module and wait for modal to be displayed
    await Promise.all([
      page.click(this.disableModuleButton(moduleTag)),
      this.waitForVisibleSelector(page, this.disableModal(moduleTag)),
    ]);

    // Confirm delete in modal and get successful message
    const [textResult] = await Promise.all([
      this.getGrowlMessageContent(page),
      page.click(this.confirmDisableModalLink(moduleTag)),
    ]);

    await this.closeGrowlMessage(page);

    return textResult;
  }

  /**
   * Enable module
   * @param page {Page} Browser tab
   * @param moduleTag {string} Name of the module
   * @return {Promise<string>}
   */
  async enableModule(page, moduleTag) {
    // Open dropdown if enable button is not displayed as first button
    if (await this.elementNotVisible(page, this.enableModuleButton(moduleTag), 1000)) {
      await page.click(this.actionsDropdownButton(moduleTag));
    }

    const [textResult] = await Promise.all([
      this.getGrowlMessageContent(page),
      page.click(this.enableModuleButton(moduleTag)),
    ]);

    await this.closeGrowlMessage(page);

    return textResult;
  }
}

module.exports = new ModuleManager();
