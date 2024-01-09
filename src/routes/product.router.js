const router = require('express').Router();
// const detectToken = require('../utils/verification');
const { validation } = require('../validations/product.validate');
const { addProduct, getProducts, getProduct, editProduct, deleteProduct }
= require('../controllers/product.controller');

router.route('/').post(validation(), addProduct);

router.route('/').get(getProducts);

router.route('/:id').get(getProduct);

router.route('/:id').put(editProduct);

router.route('/:id').delete(deleteProduct);

module.exports = router;