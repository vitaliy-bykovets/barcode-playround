const Router = require("koa-router");
const router = new Router();
const api = new Router();

// Routers
const barcodeRouter = require('./barcode.router');
const productRouter = require('./product.router');


// Set Routers
api.use(barcodeRouter);
api.use(productRouter);

// Global prefix
router.use("/api", api.routes());

module.exports = app => {
  app.use(router.routes());
  app.use(router.allowedMethods());
};
