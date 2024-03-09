const router = require('express').Router();
const customerRoute = require('./routes/customer.router');
const registerRoute = require('./registration/register.router');
const productRoute = require('./routes/product.router');
const orderRoute = require('./routes/order.router');
const cartRoute = require('./routes/cart.router');
const paymentRoute = require('./private/payment/transaction.router');

router.use('/', registerRoute);

router.use('/customer', customerRoute);

router.use('/product', productRoute);

router.use('/order', orderRoute);

router.use('/cart', cartRoute);

router.use('/payment', paymentRoute);

module.exports = router;