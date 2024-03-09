const router = require('express').Router();
const { payment } = require('./transaction');

router.route('/').post(payment);

module.exports = router;