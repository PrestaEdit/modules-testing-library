const fs = require('fs');
require('module-alias/register');
const path = require('path');

/**
 * Class to get import needed files for the given version
 * @class
 */
class VersionSelectResolver {
  /**
   * @constructs
   * Creating a resolver
   *
   * @param {string} patchVersion PrestaShop version
   * @param {json} ConfigClassMap Optional parameter for added or override classes
   */
  constructor(patchVersion, ConfigClassMap) {
    this.patchVersion = patchVersion;
    if (this.patchVersion.length === 7 || this.patchVersion.length === 8) {
      this.minorVersion = this.patchVersion.slice(0, 5);
      if (this.minorVersion.includes('1.7')) {
        this.majorVersion = '1.7';
      } else if (this.minorVersion.includes('1.6')) {
        this.majorVersion = '1.6';
      } else {
        this.majorVersion = this.minorVersion.slice(0, 1);
      }
    } else if (this.patchVersion.length === 5) {
      this.minorVersion = this.patchVersion.slice(0, 3);
      if (this.minorVersion.includes('1.7')) {
        this.majorVersion = '1.7';
      } else if (this.minorVersion.includes('1.6')) {
        this.majorVersion = '1.6';
      } else {
        this.majorVersion = this.minorVersion.slice(0, 1);
      }
    } else {
      throw new Error(`Error with version '${this.patchVersion}'`);
    }
    this.configClassMap = ConfigClassMap;
  }

  /**
   * Get file path to require
   *
   * @param {string} selector Base path of the file to import
   * @return {string} Final path of the file to import
   */
  getFilePath(selector) {
    if (this.configClassMap) {
      // Search a reference for this file in the configClassMap
      const referenceExists = this.configClassMap.find(el => el.file === selector);

      if (referenceExists) {
        // we have this file in the configClassMap
        const {versions} = referenceExists;
        if (versions[this.version]) {
          // we have the file for the correct version !
          return versions[this.version];
        }
      }
    }

    // either we don't have the file in configClassMap or we don't have a target for this version
    let versionForFilepath = this.majorVersion + '/' + this.minorVersion + '/' + this.patchVersion;

    const basePath = path.resolve(__dirname, '../..');

    if (fs.existsSync(`${basePath}/versions/${versionForFilepath}/${selector}`)) {
      return `${basePath}/versions/${versionForFilepath}/${selector}`;
    }

    versionForFilepath = this.majorVersion + '/' + this.minorVersion;

    if (fs.existsSync(`${basePath}/versions/${versionForFilepath}/${selector}`)) {
      return `${basePath}/versions/${versionForFilepath}/${selector}`;
    }

    versionForFilepath = this.majorVersion;

    if (fs.existsSync(`${basePath}/versions/${versionForFilepath}/${selector}`)) {
      return `${basePath}/versions/${versionForFilepath}/${selector}`;
    }

    throw new Error(`Couldn't find the file '${selector}' in version folder '${this.version}'`);
  }

  /**
   * Get file path and require it
   *
   * @param {string} selector Base path of the file to import
   * @return {Module} Object of the path given
   */
  require(selector) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(
      this.getFilePath(selector),
    );
  }
}

module.exports = VersionSelectResolver;
