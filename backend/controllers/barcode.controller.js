const parser = require('../core/utils/parser');

module.exports = {
  async getByCode(ctx) {
    const codeUrl = 'https://www.barcodelookup.com/';
    const { code } = ctx.query;
    const data = await parser(`${codeUrl}${code}`);
    ctx.body = { data };
  },
};
