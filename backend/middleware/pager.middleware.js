const qs = require('qs');
const { app }  = require('./../config/env');

module.exports = async (ctx, next) => {
  if (ctx.method !== 'GET') {
    await next();
  }

  ctx.query = qs.parse(ctx.querystring);

  const { query } = ctx;

  query.pageSize = parseInt(query.limit, 10) || app.pageSize;

  if (query.page) {
    query.page = parseInt(query.page, 10);
  }

  await next()
};