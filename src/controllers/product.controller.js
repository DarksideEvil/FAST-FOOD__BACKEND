const Product = require("../models/product.model");
const writeError = require("../settings/BUG/bug");
const isValid = require("mongoose").Types.ObjectId.isValid;

const addProduct = async (req, res) => {
  const existProduct = await Product.findOne({
    title: req.body.title,
    size: req.body.size,
  });
  if (existProduct) {
    return res.status(400).send({
      message: `Product '${existProduct.title}' has declared ! Change title or size of product`
    });
  }
  try {
    const newProduct = await Product.create(req.body);
    return res.status(200).json(newProduct);
  } catch (err) {
    writeError(err);
    res.status(400).send({ message: err?.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    writeError(err);
    res.status(500).send({ message: err?.message });
  }
};

const getProduct = async (req, res) => {
  if (!isValid(req.params.id)) {
    return res.status(400).send("Such product not found !");
  }
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    writeError(err);
    res.status(400).send({ message: err?.message });
  }
};

const editProduct = async (req, res) => {
  const { title, size } = req.body;
  if (!isValid(req.params.id)) {
    return res.status(400).send("Such product not found !");
  }
  try {
    const existProduct = await Product.findOne({
      $and: [ { title }, { size } ]
    });
    if (existProduct) {
      return res.status(400).send({
        message: `Product '${existProduct.title}' has declared ! Same title and size of product`
      });
    }
    
    const changedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    return res.status(200).json(changedProduct);
  } catch (err) {
    writeError(err);
    res.status(500).send({ message: err?.message });
  }
};

const deleteProduct = async (req, res) => {
  if (!isValid(req.params.id)) {
    return res.status(400).send("Such product not found !");
  }
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json(`Product has deleted !`);
  } catch (err) {
    writeError(err);
    res.status(500).send({ message: err?.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
};