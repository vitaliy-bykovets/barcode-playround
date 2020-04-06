const Koa = require('koa');
const koaJson = require('koa-json');
const koaBody = require('koa-body');

const { json }  = require('./config/env');
const config = require('./config/env');
const logger = require('./core/libs/Logger')(module);

const app = new Koa();

require('dotenv').config();

app.context.config = config; // add settings to context

app.use(koaJson(json));
app.use(koaBody());

require('./routes')(app);

// The "parent" is the module that caused the script to be interpreted (and cached), if any
if (!module.parent) {
  app.listen(process.env.PORT, () => {
    logger.info(`App running on port: ${process.env.PORT}`);
  });
}

module.exports = app;
