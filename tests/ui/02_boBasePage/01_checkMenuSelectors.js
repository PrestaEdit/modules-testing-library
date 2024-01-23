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
    pageName: 'Orders',
    parent: dashboardPage.ordersParentLink,
    children: [
      {
        pageName: 'Orders',
        pageTitle: i18n.__('Orders'),
        selector: dashboardPage.ordersLink,
      },
      {
        pageName: 'Invoices',
        pageTitle: i18n.__('Invoices'),
        selector: dashboardPage.invoicesLink,
      },
      {
        pageName: 'Credit Slips',
        pageTitle: i18n.__('Credit Slips'),
        selector: dashboardPage.creditSlipsLink,
      },
      {
        pageName: 'Delivery Slips',
        pageTitle: i18n.__('Delivery Slips'),
        selector: dashboardPage.deliverySlipslink,
      },
      {
        pageName: 'Shopping Carts',
        pageTitle: i18n.__('Shopping Carts'),
        selector: dashboardPage.shoppingCartsLink,
      },
    ],
  },
  {
    pageName: 'Catalog',
    parent: dashboardPage.catalogParentLink,
    children: [
      {
        pageName: 'Products',
        pageTitle: i18n.__('Products'),
        selector: dashboardPage.productsLink,
      },
      {
        pageName: 'Categories',
        pageTitle: i18n.__('Categories'),
        selector: dashboardPage.categoriesLink,
      },
      {
        pageName: 'Monitoring',
        pageTitle: i18n.__('Monitoring'),
        selector: dashboardPage.monitoringLink,
      },
      {
        pageName: 'Brands',
        pageTitle: i18n.__('Brands'),
        selector: dashboardPage.brandsAndSuppliersLink,
      },
      {
        pageName: 'Files',
        pageTitle: i18n.__('Files'),
        selector: dashboardPage.filesLink,
      },
      {
        pageName: 'Cart Rules',
        pageTitle: i18n.__('Cart Rules'),
        selector: dashboardPage.discountsLink,
      },
      {
        pageName: 'Stock',
        pageTitle: i18n.__('Stock'),
        selector: dashboardPage.stocksLink,
      },
    ],
  },
  {
    pageName: 'Customers',
    parent: dashboardPage.customersParentLink,
    children: [
      {
        pageName: 'Customers',
        pageTitle: i18n.__('Customers'),
        selector: dashboardPage.customersLink,
      },
      {
        pageName: 'Addresses',
        pageTitle: i18n.__('Addresses'),
        selector: dashboardPage.addressesLink,
      },
    ],
  },
  {
    pageName: 'Customer Service',
    parent: dashboardPage.customerServiceParentLink,
    children: [
      {
        pageName: 'Customer Service',
        pageTitle: i18n.__('Customer Service'),
        selector: dashboardPage.customerServiceLink,
      },
      {
        pageName: 'Order Messages',
        pageTitle: i18n.__('Order Messages'),
        selector: dashboardPage.orderMessagesLink,
      },
      {
        pageName: 'Merchandise Returns',
        pageTitle: i18n.__('Merchandise Returns'),
        selector: dashboardPage.merchandiseReturnsLink,
      },
    ],
  },
  {
    pageName: 'Modules',
    parent: dashboardPage.modulesParentLink,
    children: [
      {
        pageName: 'Manage',
        pageTitle: i18n.__('Manage'),
        selector: dashboardPage.moduleManagerLink,
      },
      {
        pageName: 'Marketplace',
        pageTitle: i18n.__('Module selection'),
        selector: dashboardPage.moduleCatalogueLink,
      },
    ],
  },
  {
    pageName: 'Design',
    parent: dashboardPage.designParentLink,
    children: [
      {
        pageName: 'Theme & Logo',
        pageTitle: i18n.__('Theme & Logo'),
        selector: dashboardPage.themeAndLogoLink,
      },
      {
        pageName: 'Email Theme',
        pageTitle: i18n.__('Email Theme'),
        selector: dashboardPage.themeMail,
      },
      {
        pageName: 'Pages',
        pageTitle: i18n.__('Pages'),
        selector: dashboardPage.pagesLink,
      },
      {
        pageName: 'Positions',
        pageTitle: i18n.__('Positions'),
        selector: dashboardPage.positionsLink,
      },
      {
        pageName: 'Image Settings',
        pageTitle: i18n.__('Image Settings'),
        selector: dashboardPage.imageSettingsLink,
      },
    ],
  },
  {
    pageName: 'Shipping',
    parent: dashboardPage.shippingParentLink,
    children: [
      {
        pageName: 'Carriers',
        pageTitle: i18n.__('Carriers'),
        selector: dashboardPage.carriersLink,
      },
      {
        pageName: 'Preferences',
        pageTitle: i18n.__('Preferences'),
        selector: dashboardPage.shippingPreferencesLink,
      },
    ],
  },
  {
    pageName: 'Payment',
    parent: dashboardPage.paymentParentLink,
    children: [
      {
        pageName: 'Payment Methods',
        pageTitle: i18n.__('Payment Methods'),
        selector: dashboardPage.paymentMethodsLink,
      },
      {
        pageName: 'Preferences',
        pageTitle: i18n.__('Preferences'),
        selector: dashboardPage.paymentPreferencesLink,
      },
    ],
  },
  {
    pageName: 'International',
    parent: dashboardPage.internationalParentLink,
    children: [
      {
        pageName: 'Localization',
        pageTitle: i18n.__('Localization'),
        selector: dashboardPage.localizationLink,
      },
      {
        pageName: 'Zones',
        pageTitle: i18n.__('Zones'),
        selector: dashboardPage.locationLink,
      },
      {
        pageName: 'Taxes',
        pageTitle: i18n.__('Taxes'),
        selector: dashboardPage.taxesLink,
      },
      {
        pageName: 'Translations',
        pageTitle: i18n.__('Translations'),
        selector: dashboardPage.translationsLink,
      },
    ],
  },
  {
    pageName: 'Parameters',
    parent: dashboardPage.shopParametersParentLink,
    children: [
      {
        pageName: 'Preferences',
        pageTitle: i18n.__('Preferences'),
        selector: dashboardPage.shopParametersGeneralLink,
      },
      {
        pageName: 'Order Settings',
        pageTitle: i18n.__('Order Settings'),
        selector: dashboardPage.orderSettingsLink,
      },
      {
        pageName: 'Product Settings',
        pageTitle: i18n.__('Product Settings'),
        selector: dashboardPage.productSettingsLink,
      },
      {
        pageName: 'Customers settings',
        pageTitle: i18n.__('Customers settings'),
        selector: dashboardPage.customerSettingsLink,
      },
      {
        pageName: 'Contacts',
        pageTitle: i18n.__('Contacts'),
        selector: dashboardPage.contactLink,
      },
      {
        pageName: 'SEO & URLs',
        pageTitle: i18n.__('SEO & URLs'),
        selector: dashboardPage.trafficAndSeoLink,
      },
      {
        pageName: 'Search',
        pageTitle: i18n.__('Search'),
        selector: dashboardPage.searchLink,
      },
    ],
  },
  {
    pageName: 'Advanced Parameters',
    parent: dashboardPage.advancedParametersLink,
    children: [
      {
        pageName: 'Information',
        pageTitle: i18n.__('Information'),
        selector: dashboardPage.informationLink,
      },
      {
        pageName: 'Performance',
        pageTitle: i18n.__('Performance'),
        selector: dashboardPage.performanceLink,
      },
      {
        pageName: 'Administration',
        pageTitle: i18n.__('Administration'),
        selector: dashboardPage.administrationLink,
      },
      {
        pageName: 'E-mail',
        pageTitle: i18n.__('E-mail'),
        selector: dashboardPage.emailLink,
      },
      {
        pageName: 'Import',
        pageTitle: i18n.__('Import'),
        selector: dashboardPage.importLink,
      },
      {
        pageName: 'Employees',
        pageTitle: i18n.__('Employees'),
        selector: dashboardPage.teamLink,
      },
      {
        pageName: 'SQL Manager',
        pageTitle: i18n.__('SQL Manager'),
        selector: dashboardPage.databaseLink,
      },
      {
        pageName: 'Logs',
        pageTitle: i18n.__('Logs'),
        selector: dashboardPage.logsLink,
      },
      {
        pageName: 'Webservice',
        pageTitle: i18n.__('Webservice'),
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
    describe(`${menuSelector.pageName}`, async () => {
      menuSelector.children.forEach((child) => {
        it(`should go to ${child.pageName} page`, async () => {
          if (child.selector !== false) {
            await dashboardPage.goToSubMenu(
              page,
              menuSelector.parent,
              child.selector,
            );

            const pageTitle = await dashboardPage.getPageTitle(page);
            await expect(pageTitle.toLowerCase()).to.contain(child.pageTitle.toLowerCase());
          } else {
            // Selector is not defined so we skip the test
            await expect(true).to.be.true;
          }
        });
      });
    });
  });
});
