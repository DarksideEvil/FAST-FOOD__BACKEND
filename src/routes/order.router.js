const router = require('express').Router();
// const detectToken = require('../utils/verification');
const { validation } = require('../validations/order.validate');
const { addOrder, getOrders, getOrder }
= require('../controllers/order.controller');

router.route('/').post(validation(), addOrder);

router.route('/').get(getOrders);

router.route('/:id').get(getOrder);

module.exports = router;