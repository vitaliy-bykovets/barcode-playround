const fetch = require("node-fetch");
const config = require('../config/env');
const apiBarcodeUrl = 'https://api.barcodelookup.com/v2/products?barcode={0}&formatted=y&key={apiKey}';

module.exports = {
  async getByCode(ctx) {
    let data, error;
    try {
      const { code } = ctx.params;
      const url = apiBarcodeUrl.replace('{0}', code).replace('{apiKey}', config.app.apiBarcodeKey);
      // const response = await fetch(url);
      // data = await response.json();
      data = {
        "products": [
          {
            "actor": "",
            "artist": "",
            "asin": "",
            "audience_rating": "Adult",
            "author": "",
            "barcode_formats": "UPC 741065002232, EAN 0741065002232",
            "barcode_number": "0741065002232",
            "barcode_type": "EAN",
            "brand": "Dkny",
            "category": "Apparel & Accessories > Clothing > Pants",
            "color": "Fallen Rock",
            "description": "Dkny Men's Bedford Slim-Straight Fit Performance Stretch Sateen Pants Men Men's Clothing - Pants (Clearance).",
            "director": "",
            "features": [],
            "format": "",
            "genre": "",
            "height": "",
            "images": [
              "https://images.barcodelookup.com/9416/94167887-1.jpg"
            ],
            "ingredients": "",
            "label": "",
            "length": "",
            "manufacturer": "Dkny",
            "model": "",
            "mpn": "43HB627",
            "nutrition_facts": "",
            "package_quantity": "",
            "product_name": "Dkny Men's Bedford Slim-Straight Fit Performance Stretch Sateen Pants",
            "publisher": "",
            "release_date": "",
            "reviews": [],
            "size": "30x32",
            "stores": [
              {
                "currency_code": "USD",
                "currency_symbol": "$",
                "product_url": "https://www.macys.com/shop/product/dkny-mens-bedford-slim-straight-fit-performance-stretch-sateen-pants?ID=10440038&PartnerID=LINKSHARE&cm_mmc=LINKSHARE-_-5-_-5-_-MP55",
                "store_name": "Macys.com",
                "store_price": "28.93"
              }
            ],
            "studio": "",
            "title": "",
            "weight": "",
            "width": ""
          }
        ]
      };
    } catch (err) {
      error = err;
    }
    ctx.body = { data, error };
  },
};
