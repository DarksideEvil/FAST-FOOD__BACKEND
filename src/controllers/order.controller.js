const Order = require('../models/order.model');
const writeError = require('../settings/BUG/bug');
const isValid = require('mongoose').Types.ObjectId.isValid;

const addOrder = async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);
        return res.status(200).json(newOrder);
    } catch (err) {writeError(err); res.status(400).send({message: err?.message});}
}

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json(orders);
    } catch (err) {writeError(err); res.status(500).send({message: err?.message});}
}

const getOrder = async (req, res) => {
    if (!isValid(req.params.id)) {
        return res.status(400).send('Such order not found !');
    }
    try {
        const order = await Order.findById(req.params.id);
        return res.status(200).json(order);
    } catch (err) {writeError(err); res.status(400).send({message: err?.message});}
}

module.exports = { addOrder, getOrders, getOrder }