require('module-alias/register');

const {expect} = require('chai');

// Get resolver
const VersionSelectResolver = require('@resolvers/versionSelectResolver');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION);

const DemoDatasResolver = require('@resolvers/demoDatasResolver');

const demoDatasResolver = new DemoDatasResolver(global.LOCALE);

// Import utils
const helper = require('@utils/helpers');

// Import data
const {Products} = demoDatasResolver.require('products');

// Import pages
const loginPage = versionSelectResolver.require('BO/login');
const dashboardPage = versionSelectResolver.require('BO/dashboard');
const productsPage = versionSelectResolver.require('BO/catalog/products');

let browserContext;
let page;

let numberOfProducts = 0;
let filterValue = '';

// Filter Products
describe('Filter Products', async () => {
  // before and after functions
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);
    page = await helper.newTab(browserContext);
  });

  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });


  it('should login in BO', async () => {
    await loginPage.goTo(page, global.BO.URL);
    const loginPageTitle = await loginPage.getPageTitle(page);
    await expect(loginPageTitle).to.contains(loginPage.pageTitle);

    await loginPage.login(page);
    await dashboardPage.closeOnboardingModal(page);

    const dashboardPageTitle = await dashboardPage.getPageTitle(page);
    await expect(dashboardPageTitle).to.contains(dashboardPage.pageTitle);
  });

  it('should go to "Catalog>products" page', async () => {
    await dashboardPage.goToSubMenu(
      page,
      dashboardPage.catalogParentLink,
      dashboardPage.productsLink,
    );

    await productsPage.closeSfToolBar(page);

    const pageTitle = await productsPage.getPageTitle(page);
    await expect(pageTitle).to.contains(productsPage.pageTitle);
  });

  it('should reset all filters and get number of products', async () => {
    numberOfProducts = await productsPage.resetAndGetNumberOfLines(page);
    await expect(numberOfProducts).to.be.above(0);
  });

  // 1 : Filter products with all inputs and selects in grid table
  describe('Filter products', async () => {
    const tests = [
      {
        args:
          {
            testIdentifier: 'filterId',
            filterType: 'input',
            filterBy: 'id_product',
            filterValue: {min: Products.demo_1.id, max: Products.demo_6.id},
          },
      },
      {
        args:
          {
            testIdentifier: 'filterName',
            filterType: 'input',
            filterBy: 'name',
            filterValue: Products.demo_14.name,
          },
      },
      {
        args:
          {
            testIdentifier: 'filterReference',
            filterType: 'input',
            filterBy: 'reference',
            filterValue: Products.demo_3.reference,
          },
      },
      {
        args:
          {
            testIdentifier: 'filterCategoryName',
            filterType: 'input',
            filterBy: 'name_category',
            filterValue: Products.demo_5.category,
          },
      },
      {
        args: {
          testIdentifier: 'filterPrice',
          filterType: 'input',
          filterBy: 'price',
          filterValue: {min: Products.demo_1.price, max: Products.demo_3.price},
        },
      },
      {
        args: {
          testIdentifier: 'filterQuantity',
          filterType: 'input',
          filterBy: 'sav_quantity',
          filterValue: {min: Products.demo_6.quantity, max: Products.demo_1.quantity},
        },
      },

      {
        args:
          {
            testIdentifier: 'filterActive',
            filterType: 'select',
            filterBy: 'active',
            filterValue: Products.demo_1.status,
          },
      },
    ];

    tests.forEach((test) => {
      filterValue = test.args.filterValue.min === undefined ? `'${test.args.filterValue}'`
        : `'${test.args.filterValue.min}-${test.args.filterValue.max}'`;

      it(`should filter by ${test.args.filterBy} ${filterValue}`, async () => {
        await productsPage.filterProducts(
          page,
          test.args.filterBy,
          test.args.filterValue,
          test.args.filterType,
        );

        const numberOfProductsAfterFilter = await productsPage.getNumberOfProductsFromList(page);
        await expect(numberOfProductsAfterFilter).to.within(0, numberOfProducts);

        for (let i = 1; i <= numberOfProductsAfterFilter; i++) {
          if (test.args.filterBy === 'active') {
            const productStatus = await productsPage.getProductStatusFromList(page, i);
            await expect(productStatus).to.equal(test.args.filterValue);
          } else {
            const textColumn = await productsPage.getTextColumn(page, test.args.filterBy, i);

            if (test.args.filterValue.min !== undefined) {
              await expect(textColumn).to.within(test.args.filterValue.min, test.args.filterValue.max);
            } else {
              await expect(textColumn).to.contains(test.args.filterValue);
            }
          }
        }
      });

      it('should reset all filters', async () => {
        const numberOfProductsAfterReset = await productsPage.resetAndGetNumberOfLines(page);
        await expect(numberOfProductsAfterReset).to.equal(numberOfProducts);
      });
    });
  });

  // 2 : Editing products from table
  describe('Quick Edit products', async () => {
    it('should filter by Name \'Hummingbird printed sweater\'', async () => {
      await productsPage.filterProducts(page, 'name', Products.demo_3.name);

      const numberOfProductsAfterFilter = await productsPage.getNumberOfProductsFromList(page);
      await expect(numberOfProductsAfterFilter).to.be.below(numberOfProducts);

      for (let i = 1; i <= numberOfProductsAfterFilter; i++) {
        const textColumn = await productsPage.getProductNameFromList(page, i);
        await expect(textColumn).to.contains(Products.demo_3.name);
      }
    });

    const statuses = [
      {args: {status: 'disable', enable: false}},
      {args: {status: 'enable', enable: true}},
    ];

    statuses.forEach((productStatus) => {
      it(`should ${productStatus.args.status} the product`, async () => {
        const isActionPerformed = await productsPage.setProductStatus(
          page,
          1,
          productStatus.args.enable,
        );

        if (isActionPerformed) {
          const resultMessage = await productsPage.getAlertSuccessBlockParagraphContent(page);

          if (productStatus.args.enable) {
            await expect(resultMessage).to.contains(productsPage.productActivatedSuccessfulMessage);
          } else {
            await expect(resultMessage).to.contains(productsPage.productDeactivatedSuccessfulMessage);
          }
        }

        const currentStatus = await productsPage.getProductStatusFromList(page, 1);
        await expect(currentStatus).to.be.equal(productStatus.args.enable);
      });
    });
  });
});
