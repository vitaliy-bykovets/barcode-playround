const { bookshelf } = require('./../config/database');

module.exports = bookshelf.Model.extend({
  tableName: 'products',
});
