const i18n = require('i18n');
const faker = require('faker');

const behavior = [i18n.__('Deny orders'), i18n.__('Allow orders'), i18n.__('Default behavior')];

module.exports = class Product {
  constructor(productToCreate) {
    this.name = (productToCreate.name || faker.commerce.productName()).toUpperCase();
    this.coverImage = productToCreate.coverImage || null;
    this.thumbImage = productToCreate.thumbImage || null;
    this.type = productToCreate.type;
    this.status = productToCreate.status === undefined ? true : productToCreate.status;
    this.summary = productToCreate.summary === undefined ? faker.lorem.sentence() : productToCreate.summary;
    this.description = productToCreate.description === undefined ? faker.lorem.sentence() : productToCreate.description;
    this.reference = productToCreate.reference || faker.random.alphaNumeric(7);
    this.quantity = productToCreate.quantity === undefined
      ? faker.random.number({min: 1, max: 9})
      : productToCreate.quantity;
    this.price = productToCreate.price === undefined ? faker.random.number({min: 10, max: 20}) : productToCreate.price;
    this.combinations = productToCreate.combinations || {
      Color: [i18n.__('White'), i18n.__('Black')],
      Size: ['S', 'M'],
    };
    this.pack = productToCreate.pack || {
      demo_1: faker.random.number({min: 10, max: 100}),
      demo_2: faker.random.number({min: 10, max: 100}),
    };
    this.taxRule = productToCreate.taxRule || i18n.__('FR Taux standard (20%)');
    this.specificPrice = productToCreate.specificPrice || {
      combinations: i18n.__('Size - S, Color - White'),
      discount: faker.random.number({min: 10, max: 100}),
      startingAt: faker.random.number({min: 2, max: 5}),
    };
    this.minimumQuantity = productToCreate.minimumQuantity === undefined
      ? faker.random.number({min: 1, max: 9})
      : productToCreate.minimumQuantity;
    this.stockLocation = productToCreate.stockLocation || i18n.__('Stock location');
    this.lowStockLevel = productToCreate.lowStockLevel;
    this.labelWhenInStock = productToCreate.labelWhenInStock || i18n.__('Label when in stock');
    this.LabelWhenOutOfStock = productToCreate.LabelWhenOutOfStock || i18n.__('Label when out of stock');
    this.behaviourOutOfStock = productToCreate.behaviourOutOfStock || faker.random.arrayElement(behavior);
  }
};
