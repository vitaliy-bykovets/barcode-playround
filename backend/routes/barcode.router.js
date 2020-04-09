const Router = require('koa-router');
const ctrl = require('./../controllers').barcode;

const router = new Router();

router.get('/barcode/:code/', ctrl.getByCode);
router.post('/product', ctrl.saveProduct);
router.del('/barcode/:id', ctrl.deleteProduct);

module.exports = router.routes();
