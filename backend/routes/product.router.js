const Router = require('koa-router');
const ctrl = require('./../controllers').product;

const router = new Router();

router.get('/product', ctrl.getAll);
router.post('/product/', ctrl.saveProduct);
router.del('/product/:id', ctrl.deleteProduct);

module.exports = router.routes();
