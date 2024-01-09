const router = require('express').Router();
const customerRoute = require('./routes/customer.router');
const registerRoute = require('./registration/register.router');
const productRoute = require('./routes/product.router');

router.use('/customer', customerRoute);

router.use('/', registerRoute);

router.use('/product', productRoute);

module.exports = router;