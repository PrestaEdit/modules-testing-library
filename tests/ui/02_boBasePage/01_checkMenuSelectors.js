require('module-alias/register');

const i18n = require('i18n');
const {expect} = require('chai');
const helper = require('@utils/helpers');

// Get resolver
const VersionSelectResolver = require('@resolvers/versionSelectResolver');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION);

// Import pages
const loginPage = versionSelectResolver.require('BO/login/index.js');
const dashboardPage = versionSelectResolver.require('BO/dashboard/index.js');

// Browser vars
let browserContext;
let page;

const menuSelectors = [
  {
    parent: dashboardPage.ordersParentLink,
    children: [
      {
        pageName: i18n.__('Orders'),
        selector: dashboardPage.ordersLink,
      },
      {
        pageName: i18n.__('Invoices'),
        selector: dashboardPage.invoicesLink,
      },
      {
        pageName: i18n.__('Credit Slips'),
        selector: dashboardPage.creditSlipsLink,
      },
      {
        pageName: i18n.__('Delivery Slips'),
        selector: dashboardPage.deliverySlipslink,
      },
      {
        pageName: i18n.__('Shopping Carts'),
        selector: dashboardPage.shoppingCartsLink,
      },
    ],
  },
  {
    parent: dashboardPage.catalogParentLink,
    children: [
      {
        pageName: i18n.__('Products'),
        selector: dashboardPage.productsLink,
      },
      {
        pageName: i18n.__('Categories'),
        selector: dashboardPage.categoriesLink,
      },
      {
        pageName: i18n.__('Monitoring'),
        selector: dashboardPage.monitoringLink,
      },
      {
        pageName: i18n.__('Brands'),
        selector: dashboardPage.brandsAndSuppliersLink,
      },
      {
        pageName: i18n.__('Files'),
        selector: dashboardPage.filesLink,
      },
      {
        pageName: i18n.__('Cart Rules'),
        selector: dashboardPage.discountsLink,
      },
      {
        pageName: i18n.__('Stock'),
        selector: dashboardPage.stocksLink,
      },
    ],
  },
  {
    parent: dashboardPage.customersParentLink,
    children: [
      {
        pageName: i18n.__('Customers'),
        selector: dashboardPage.customersLink,
      },
      {
        pageName: i18n.__('Addresses'),
        selector: dashboardPage.addressesLink,
      },
    ],
  },
  {
    parent: dashboardPage.customerServiceParentLink,
    children: [
      {
        pageName: i18n.__('Customer Service'),
        selector: dashboardPage.customerServiceLink,
      },
      {
        pageName: i18n.__('Order Messages'),
        selector: dashboardPage.orderMessagesLink,
      },
      {
        pageName: i18n.__('Merchandise Returns'),
        selector: dashboardPage.merchandiseReturnsLink,
      },
    ],
  },
  {
    parent: dashboardPage.modulesParentLink,
    children: [
      {
        pageName: i18n.__('Manage'),
        selector: dashboardPage.moduleManagerLink,
      },
      {
        pageName: i18n.__('Modules catalog'),
        selector: dashboardPage.moduleCatalogueLink,
      },
    ],
  },
  {
    parent: dashboardPage.designParentLink,
    children: [
      {
        pageName: i18n.__('Theme & Logo'),
        selector: dashboardPage.themeAndLogoLink,
      },
      {
        pageName: i18n.__('Theme'),
        selector: dashboardPage.themeCatalog,
      },
      {
        pageName: i18n.__('Pages'),
        selector: dashboardPage.pagesLink,
      },
      {
        pageName: i18n.__('Positions'),
        selector: dashboardPage.positionsLink,
      },
      {
        pageName: i18n.__('Image Settings'),
        selector: dashboardPage.imageSettingsLink,
      },
    ],
  },
  {
    parent: dashboardPage.shippingParentLink,
    children: [
      {
        pageName: i18n.__('Carriers'),
        selector: dashboardPage.carriersLink,
      },
      {
        pageName: i18n.__('Preferences'),
        selector: dashboardPage.shippingPreferencesLink,
      },
    ],
  },
  {
    parent: dashboardPage.paymentParentLink,
    children: [
      {
        pageName: i18n.__('Payment Methods'),
        selector: dashboardPage.paymentMethodsLink,
      },
      {
        pageName: i18n.__('Preferences'),
        selector: dashboardPage.paymentPreferencesLink,
      },
    ],
  },
  {
    parent: dashboardPage.internationalParentLink,
    children: [
      {
        pageName: i18n.__('Localization'),
        selector: dashboardPage.localizationLink,
      },
      {
        pageName: i18n.__('Zones'),
        selector: dashboardPage.locationLink,
      },
      {
        pageName: i18n.__('Taxes'),
        selector: dashboardPage.taxesLink,
      },
      {
        pageName: i18n.__('Translations'),
        selector: dashboardPage.translationsLink,
      },
    ],
  },
  {
    parent: dashboardPage.shopParametersParentLink,
    children: [
      {
        pageName: i18n.__('Preferences'),
        selector: dashboardPage.shopParametersGeneralLink,
      },
      {
        pageName: i18n.__('Order Settings'),
        selector: dashboardPage.orderSettingsLink,
      },
      {
        pageName: i18n.__('Product Settings'),
        selector: dashboardPage.productSettingsLink,
      },
      {
        pageName: i18n.__('Customers'),
        selector: dashboardPage.customerSettingsLink,
      },
      {
        pageName: i18n.__('Contacts'),
        selector: dashboardPage.contactLink,
      },
      {
        pageName: i18n.__('SEO & URLs'),
        selector: dashboardPage.trafficAndSeoLink,
      },
      {
        pageName: i18n.__('Search'),
        selector: dashboardPage.searchLink,
      },
    ],
  },
  {
    parent: dashboardPage.advancedParametersLink,
    children: [
      {
        pageName: i18n.__('Information'),
        selector: dashboardPage.informationLink,
      },
      {
        pageName: i18n.__('Performance'),
        selector: dashboardPage.performanceLink,
      },
      {
        pageName: i18n.__('Administration'),
        selector: dashboardPage.administrationLink,
      },
      {
        pageName: i18n.__('E-mail'),
        selector: dashboardPage.emailLink,
      },
      {
        pageName: i18n.__('Import'),
        selector: dashboardPage.importLink,
      },
      {
        pageName: i18n.__('Employees'),
        selector: dashboardPage.teamLink,
      },
      {
        pageName: i18n.__('SQL Manager'),
        selector: dashboardPage.databaseLink,
      },
      {
        pageName: i18n.__('Logs'),
        selector: dashboardPage.logsLink,
      },
      {
        pageName: i18n.__('Webservice'),
        selector: dashboardPage.webserviceLink,
      },
    ],
  },
];

describe('Check Menu selectors in BO', async () => {
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);

    page = await helper.newTab(browserContext);
  });

  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });

  it('should log in to BO', async () => {
    await loginPage.goTo(page, global.BO.URL);

    await loginPage.login(page);
    await dashboardPage.closeOnboardingModal(page);

    const pageTitle = await dashboardPage.getPageTitle(page);
    await expect(pageTitle).to.contain(dashboardPage.pageTitle);
  });

  menuSelectors.forEach((menuSelector) => {
    menuSelector.children.forEach((child) => {
      it(`should go to ${child.pageName} page`, async () => {
        await dashboardPage.goToSubMenu(
          page,
          menuSelector.parent,
          child.selector,
        );

        const pageTitle = await dashboardPage.getPageTitle(page);
        await expect(pageTitle.toLowerCase()).to.contain(child.pageName.toLowerCase());
      });
    });
  });
});
