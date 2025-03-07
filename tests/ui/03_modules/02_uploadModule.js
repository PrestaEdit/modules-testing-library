require('module-alias/register');

const {expect} = require('chai');
const helper = require('@utils/helpers');

// Get resolver
const VersionSelectResolver = require('@resolvers/versionSelectResolver');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION);

// Import pages
const loginPage = versionSelectResolver.require('BO/login/index.js');
const dashboardPage = versionSelectResolver.require('BO/dashboard/index.js');
const moduleManagerPage = versionSelectResolver.require('BO/modules/moduleManager/index.js');
const moduleConfigurationPage = versionSelectResolver.require('BO/modules/moduleConfiguration/index.js');

// Browser vars
let browserContext;
let page;

const moduleToInstall = {
  name: 'Test Library Module',
  tag: 'testlibmodule',
  filePath: `${process.cwd()}/tests/ui/data/testlibmodule.zip`,
};

/*
Log in into BO
Go to module manager page
Upload zip module
Check that module is installed
 */
describe('Install module with zip', async () => {
  // before and after functions
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);

    page = await helper.newTab(browserContext);
  });

  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });

  it('should login into BO', async () => {
    await loginPage.goTo(page, global.BO.URL);
    const loginPageTitle = await loginPage.getPageTitle(page);
    await expect(loginPageTitle).to.contains(loginPage.pageTitle);

    await loginPage.login(page);
    await dashboardPage.closeOnboardingModal(page);

    const dashboardPageTitle = await dashboardPage.getPageTitle(page);
    await expect(dashboardPageTitle).to.contains(dashboardPage.pageTitle);
  });

  it('should go to modules manager page', async () => {
    await dashboardPage.goToSubMenu(
      page,
      dashboardPage.modulesParentLink,
      dashboardPage.moduleManagerLink,
    );

    const pageTitle = await moduleManagerPage.getPageTitle(page);
    await expect(pageTitle).to.contains(moduleManagerPage.pageTitle);
  });

  it('should upload the module using the modal', async () => {
    const result = await moduleManagerPage.uploadModule(page, moduleToInstall.filePath);
    await expect(result).to.be.true;
  });

  it('should check that the module was installed', async () => {
    await moduleManagerPage.closeUploadModuleModal(page);
    await moduleManagerPage.reloadPage(page);
    const isModuleVisible = await moduleManagerPage.searchModule(page, moduleToInstall.tag);

    await expect(isModuleVisible).to.be.true;
  });

  it('should check that the module is enabled', async () => {
    const isModuleEnabled = await moduleManagerPage.isModuleEnabled(page, moduleToInstall.tag);
    await expect(isModuleEnabled).to.be.true;
  });

  it('should go to configuration page', async () => {
    await moduleManagerPage.goToConfigurationPage(page, moduleToInstall.tag);

    // Check module name
    const pageSubtitle = await moduleConfigurationPage.getPageSubtitle(page);
    await expect(pageSubtitle).to.contain(moduleToInstall.name);
  });
});
