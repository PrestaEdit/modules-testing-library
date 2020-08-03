const {expect} = require('chai');
const loginPage = require('../pages/BO/login');
const dashboardPage = require('../../commun/pages/BO/dashboard');

module.exports = {
  async loginBO(mochaContext, page) {
    await loginPage.goTo(page, global.BO.URL);
    await loginPage.login(page, global.BO.EMAIL, global.BO.PASSWD);
    const pageTitle = await dashboardPage.getPageTitle(page);
    console.log('test 177');

    await expect(pageTitle).to.contains(dashboardPage.pageTitle);
    await dashboardPage.closeOnboardingModal(page);
  },

  async logoutBO(mochaContext, page) {
    await dashboardPage.logoutBO(page);
    const pageTitle = await loginPage.getPageTitle(page);
    await expect(pageTitle).to.contains(loginPage.pageTitle);
  },
};
