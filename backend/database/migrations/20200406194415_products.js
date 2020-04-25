
exports.up = (knex) => {
  return knex.schema.createTable('products', table => {

    table.increments('id').primary();
    table.string('barcode_number')
      .notNullable();
    table.text('product_name');
    table.string('brand');
    table.string('category');
    table.string('attributes');
    table.text('description');
    table.string('manufacturer');
    table.string('imgUrl');
    table.string('color');
    table.string('height');
    table.string('length');
    table.string('size');
    table.string('weight');
    table.string('width');
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('products');
};
