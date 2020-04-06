
exports.up = async (knex) => {
  return await knex.schema.createTable('barcodes', table => {

    table.increments().primary();
    table.string('barcode')
      .notNullable();
    table.string('name');
    table.string('category');
    table.string('attributes');
    table.string('description');
    table.string('manufacturer');
    table.string('imgUrl');
  })
};

exports.down = async (knex) => {
  return await knex.schema.dropTableIfExists('barcodes');
};
