const router = require('express').Router();
const customerRoute = require('./routes/customer.router');
const registerRoute = require('./registration/register.router');
const productRoute = require('./routes/product.router');
const orderRoute = require('./routes/order.router');

router.use('/', registerRoute);

router.use('/customer', customerRoute);

router.use('/product', productRoute);

router.use('/order', orderRoute);

module.exports = router;