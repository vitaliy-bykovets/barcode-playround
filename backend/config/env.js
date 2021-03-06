// require('./../core/env.init'); // run env initialization
require('dotenv').config();

// File with constants
const config = {
  app: {
    jwtExpireDuration: 86400 * 60, // 2 months
    password: {
      recovery_timeout: 600
    },
    pageSize: 25,
    defaultSortColumn: 'name',
    apiBarcodeKey: process.env.BARCODE_API_KEY,
  },
  database: { // settings for knex
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      charset: 'utf8mb4'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    },
    pool: {
      min: 1,
      max: 1
    }
  },
  json: { pretty: false }, // settings for koaJson
};

module.exports = config;
