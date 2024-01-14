require('module-alias/register');

const {expect, assert} = require('chai');
const helper = require('@utils/helpers');

// Get resolver
const VersionSelectResolver = require('@resolvers/versionSelectResolver');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION);

// Import pages
const homePage = versionSelectResolver.require('FO/home/index.js');
const categoryPage = versionSelectResolver.require('FO/category/index.js');
const productPage = versionSelectResolver.require('FO/product/index.js');
const contactPage = versionSelectResolver.require('FO/contact/index.js');

// Browser vars
let browserContext;
let page;

/*
Desc
 */
describe.only('Front Office', async () => {
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);

    page = await helper.newTab(browserContext);
  });

  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });

  describe('Home', async () => {
    it('should open my shop', async () => {
      await homePage.goTo(page, global.FO.URL);

      const currentUrl = await homePage.getCurrentURL(page);
      await expect(currentUrl, 'Failed to open FO').to.contain(global.FO.URL);
    });
  });

  describe('Contact', async () => {
    it('should go to contact page', async () => {
      await contactPage.navigate(page, homePage.contactLink);

      const pageTitle = await contactPage.getPageTitle(page);
      await expect(pageTitle).to.contains(contactPage.pageTitle);
    });

    it('should not change Front Office', async () => {
      const fail = await helper.visualComparison(page, contactPage);
      if (fail) {
        assert.fail('Design seems broken');
      }
    });
  });

  describe('Categories', async () => {
    it('should go to category', async () => {
      await categoryPage.navigate(page, homePage.desktopTopMenuClothesLink);

      const pageTitle = await categoryPage.getPageTitle(page);
      await expect(pageTitle).to.contains(categoryPage.pageTitle);
    });

    it('should not change Front Office', async () => {
      const fail = await helper.visualComparison(page, categoryPage, 'category-3');
      if (fail) {
        assert.fail('Design seems broken');
      }
    });
  });

  describe('Products', async () => {
    it('should go to product', async () => {
      await productPage.navigate(page, categoryPage.productOnListing);

      const pageTitle = await productPage.getPageTitle(page);
      await expect(pageTitle).to.contains(productPage.pageTitle);
    });

    it('should not change Front Office', async () => {
      const fail = await helper.visualComparison(page, productPage, 'product-1');
      if (fail) {
        assert.fail('Design seems broken');
      }
    });
  });
});
