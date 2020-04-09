const Router = require("koa-router");
const router = new Router();
const api = new Router();

// Routers
const barcodeRouter = require('./barcode.router');

// Middleware
const {
  pagerMiddleware,
} = require('./../middleware');

// Set Routers
api.use(barcodeRouter);

// Global prefix
router.use("/api", api.routes());

module.exports = app => {

  // Middleware
  // app.use(pagerMiddleware);

  app.use(router.routes());
  // app.use(router.allowedMethods());
};
