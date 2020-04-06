const { database } = require('./config/env');

module.exports = {
  development: database,
  production: database,
  testing: database
};