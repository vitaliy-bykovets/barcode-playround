const fetch = require("node-fetch");
const config = require('../config/env');
const apiBarcodeUrl = 'https://api.barcodelookup.com/v2/products?barcode={0}&formatted=y&key={apiKey}';

module.exports = {
  async getByCode(ctx) {
    let data, error;
    try {
      const { code } = ctx.params;
      const url = apiBarcodeUrl.replace('{0}', code).replace('{apiKey}', config.app.apiBarcodeKey);
      const response = await fetch(url);
      data = await response.json();
    } catch (err) {
      error = err;
    }
    ctx.body = { data, error };
  },
};
