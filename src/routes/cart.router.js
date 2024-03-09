const router = require('express').Router();
// const detectToken = require('../utils/verification');
const { validation } = require('../validations/cart.validate');
const { addItemCart, getCarts, getCart, editCart, deleteCart }
= require('../controllers/cart.controller');

router.route('/add-to-cart').post(validation(), addItemCart);

router.route('/').get(getCarts);

router.route('/:id').get(getCart);

router.route('/:customer/items/:itemId').patch(editCart);

router.route('/:id').delete(deleteCart);

module.exports = router;