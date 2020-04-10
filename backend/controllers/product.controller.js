const { Product } = require('./../models');

module.exports = {
  async getAll(ctx) {
    const data = await Product.fetchAll();
    ctx.body = { data };
  },

  async saveProduct(ctx) {
    let data = null, error;

    const { body } = ctx.request;
    const req = JSON.parse(body);
    const {
      barcode_number,
      product_name,
      brand,
      category,
      attributes,
      description,
      manufacturer,
      color,
      height,
      length,
      size,
      weight,
      width,
    } = req;
    try {
      data = await Product.create({
        barcode_number,
        product_name,
        brand,
        category,
        attributes,
        description,
        manufacturer,
        color,
        height,
        length,
        size,
        weight,
        width,
        imgUrl: req.images[0],
      });
    } catch (err) {
      error = err;
    }

    ctx.body = { data, error };
  },

  async deleteProduct(ctx) {

    let data = null, error;

    const { id } = ctx.params;
    try {
      data = await Product.destroy({ id });
      await data.destroy();
    } catch (err) {
      error = err;
    }

    ctx.body = { data, error };
  },
};
