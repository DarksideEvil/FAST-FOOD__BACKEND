const Customer = require('../models/customer.model');
const CryptoJs = require('crypto-js');
const writeError = require('../settings/BUG/bug');
const isValid = require('mongoose').Types.ObjectId.isValid;

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        return res.status(200).json(customers);
    } catch (err) {writeError(err); res.status(500).send({message: err?.message});}
}

const getCustomer = async (req, res) => {
    if (!isValid(req.params.id)) {
        return res.status(400).send('Such customer not found !');
    }
    try {
        const customer = await Customer.findById(req.params.id)
        .select('-password');
        return res.status(200).json(customer);
    } catch (err) {writeError(err); res.status(400).send({message: err?.message});}
}

const editCustomer = async (req, res) => {
    if (!isValid(req.params.id)) {
        return res.status(400).send('Such customer not found !');
    }
    const { password, ...others } = req.body;
    const deservePswd = await CryptoJs.AES.encrypt(password, process.env.CRYPTO_HASH_SECRET).toString();
    try {
        const changedCustomer = await Customer.findByIdAndUpdate(
            req.params.id, 
            {...others, password: deservePswd}, 
            {new: true}
        );
        return res.status(200).json(changedCustomer);
    } catch (err) {writeError(err); res.status(500).send({message: err?.message});}
}

const deleteCustomer = async (req, res) => {
    if (!isValid(req.params.id)) {
        return res.status(400).send('Such customer not found !');
    }
    try {
        await Customer.findByIdAndDelete(req.params.id);
        return res.status(200).json(`Customer has deleted !`);
    } catch (err) {writeError(err); res.status(500).send({message: err?.message});}
}

module.exports = {getCustomers, getCustomer, editCustomer, deleteCustomer}