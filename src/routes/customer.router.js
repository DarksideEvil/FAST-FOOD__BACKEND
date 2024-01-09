const router = require('express').Router()
// const detectToken = require('../utils/verification');

const {getCustomers, getCustomer, editCustomer, deleteCustomer} = require('../controllers/customer.controller');

router.route('/').get(getCustomers);

router.route('/:id').get(getCustomer);

router.route('/:id').put(editCustomer);

router.route('/:id').delete(deleteCustomer);

module.exports = router;