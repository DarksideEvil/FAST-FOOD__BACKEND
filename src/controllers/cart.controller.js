const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const writeError = require('../settings/BUG/bug');

// Add an item to a cart.
async function addItemCart(req, res) {
  const { customer, products } = req.body;
  const field = products[0];
  const product = field.product;
  const quantity = field.quantity;
  const size = field.size;
    try {
      const existCart = await Cart.findOne({ customer });
      if (!existCart) {
        return handleNewCart(req, res, product, quantity, size, customer);
      } else {
        return handleExistingCart(req, res, existCart, product, quantity, size);
      }
    } catch (err) {
        writeError(err);
        console.error(err);
        return res.status(500).send({ message: `Internal Server Error: ${err.message}` });
    }
}
  
  async function handleNewCart(req, res, product, quantity, size, customer) {
    try {
      const foundProduct = await Product.findById(product);
      if (!foundProduct) {
        return res.status(400).send({ message: 'Such product not found !' });
      }
      const currentStockQuantity = foundProduct.instock;
      const quantityToAdd = quantity;
      if (quantityToAdd > currentStockQuantity) {
        return res.status(400).send({ message: 'Insufficient stock quantity !' });
      }
      foundProduct.instock -= quantityToAdd;
      await foundProduct.save();
      const newItem = {
        product: foundProduct._id,
        quantity,
        size,
        price: foundProduct.price,
        totalPrice: foundProduct.price * quantity,
      };
      const newCart = new Cart({
        customer,
        products: [newItem],
      });
      await newCart.save();
      return res.status(200).json(newCart);
    } catch (err) {
        writeError(err);
        console.error(err);
        return res.status(500).send({ message: `Internal Server Error: ${err.message}` });
    }
  }
  
  async function handleExistingCart(req, res, existCart, product, quantity, size) {
    try {
      const foundProduct = await Product.findById(product);
      if (!foundProduct) {
        return res.status(400).send({ message: 'Such product not found !' });
      }
      const currentStockQuantity = foundProduct.instock;
      const quantityToAdd = quantity;
      if (quantityToAdd > currentStockQuantity) {
        return res.status(400).send({ message: 'Insufficient stock quantity !' });
      }
      foundProduct.instock -= quantityToAdd;
      await foundProduct.save();
      const newItem = {
        product: foundProduct._id,
        quantity,
        size,
        price: foundProduct.price,
        totalPrice: foundProduct.price * quantity,
      };
      existCart.products.push(newItem);
      await existCart.save();
      return res.status(200).json(existCart);
    } catch (err) {
      writeError(err);
      console.error(err);
      return res.status(500).send({ message: `Internal Server Error: ${err.message}` });
    }
}
// Get all carts.
async function getCarts (req, res) {
    try {
        const carts = await Cart.find().populate('customer', 'fullname')
        .populate('products.product', 'title');
        return res.status(200).json(carts);
    } catch (err) {
        writeError(err);
        console.error(err);
        return res.status(500).send({ message: `Internal Server Error: ${err.message}` });
    }
}
// Get a cart by ID.
async function getCart (req, res) {
    if (!isValid(req.params.id)) {
        return res.status(400).send('Such cart not found !');
    }
    try {
        const cart = await Cart.findOne({customer: req.params.id}).populate('customer', 'fullname')
        .populate('products', 'product');
        return res.status(200).json(cart);
    } catch (err) {
        writeError(err);
        console.error(err);
        return res.status(400).send({ message: err.message });
    }
}
// Update an item in a cart.
async function editCart(req, res) {
  const { customer, itemId } = req.params;
  const { removeId } = req.query;
  const { quantity, size } = req.body;

  try {
    const cart = await Cart.findOne({ customer });
    if (!cart) {
      return res.status(400).send({ message: 'Your cart not found !' });
    }

    if (removeId) {
      cart.products = cart.products.filter(product => product.product != removeId);
      await cart.save();
    }
    
    const productIndex = cart.products.findIndex(item => item.product == itemId);
    if (productIndex === -1) {
      return res.status(400).send({ message: 'Product not found in cart !' });
    }

    let productPrice;
    const product = cart.products[productIndex];
    if (quantity && product.quantity !== quantity) {
      product.quantity = quantity;
      productPrice = product.price;
    }
    if (size && product.size !== size) {
      product.size = size;
    }

    const totalPrice = productPrice * quantity;
    const updatedProducts = [...cart.products];
    updatedProducts[productIndex] = product;

    const existCart = await Cart.findOneAndUpdate(
      { customer },
      { products: updatedProducts },
      { new: true, projection: { products: 1 } }
    );

    const updatedProduct = await Product.findById(itemId);
    if (!updatedProduct) {
      return res.status(400).send({ message: 'Product not found !' });
    }

    if (quantity && quantity > updatedProduct.instock) {
      return res.status(400).send({ message: 'Insufficient stock !' });
    }

    updatedProduct.instock -= quantity;
    await updatedProduct.save();

    return res.status(200).json(existCart.products);
  } catch (err) {
    writeError(err);
    console.error(err);
    return res.status(500).send({ message: `Internal Server Error: ${err.message}` });
  }
}
// Delete a cart.
async function deleteCart (req, res) {
    try {
        const existCart = await Cart.findOne({customer: req.params.id});
        if (!existCart) {
            return res.status(400).send({message: 'Such cart not found !'});
        }
        existCart.products = [];
        await existCart.save();
        return res.status(200).json(existCart);
    } catch (err) {
        writeError(err);
        console.error(err);
        return res.status(500).send({ message: `Internal Server Error: ${err.message}` });
    }
}

module.exports = { addItemCart, getCarts, getCart, editCart, deleteCart }