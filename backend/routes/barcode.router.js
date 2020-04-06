const Router = require('koa-router');
const ctrl = require('./../controllers').barcode;

const router = new Router();

router.get('/barcode/:code', ctrl.getByCode);

module.exports = router.routes();
