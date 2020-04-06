const knexInstance = require('knex');
const bookshelfInstance = require('bookshelf');

const { database } = require('./env');

const knex = knexInstance(database);
const bookshelf = bookshelfInstance(knex);

bookshelf.plugin(require('bookshelf-modelbase').pluggable, {});
bookshelf.plugin(['registry', 'virtuals', 'visibility', 'pagination'], {});

module.exports = { bookshelf, knex };
