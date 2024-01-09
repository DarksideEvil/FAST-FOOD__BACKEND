const router = require('express').Router();
const { registration, authentication } = require('./register');
const validation = require('../validations/customer.validate');

router.route('/signup').post(validation(), registration);

router.route('/signin').post(authentication);

module.exports = router;