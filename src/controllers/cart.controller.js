const { default: mongoose } = require("mongoose");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const writeError = require("../settings/BUG/bug");
const isValid = require("mongoose").Types.ObjectId.isValid;
const Decimal = require("decimal.js");

// Add an item to a cart.
async function addItemCart(req, res) {
  const { customer, products } = req.body;

  if (!customer || !products) {
    return res.status(400).send({
      message: "Invalid request. Customer and products are required.",
    });
  }

  const field = products[0];
  const product = field.product;
  const quantity = field.quantity;
  const size = field.size;

  try {
    const existCart = await Cart.findOne({ customer })
      .populate("customer", "fullname")
      .populate("products.product", "title");
    // similarItemDetector(customer, product);
    if (!existCart) {
      await handleNewCart(req, res, product, quantity, size, customer);
    } else {
      await handleExistingCart(req, res, existCart, product, quantity, size);
    }
  } catch (err) {
    writeError(err);
    console.error(err);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${err.message}` });
  }
}

async function handleNewCart(req, res, product, quantity, size, customer) {
  try {
    const foundProduct = await Product.findById(product);

    if (!foundProduct) {
      return res.status(400).send({ message: "Such product not found !" });
    }

    const currentStockQuantity = foundProduct.instock;
    const quantityToAdd = quantity;

    if (quantityToAdd > currentStockQuantity) {
      return res.status(400).send({
        message: `There are only ${currentStockQuantity} units for sale !`,
      });
    }

    const newItem = {
      product: foundProduct._id,
      quantity,
      size,
      price: foundProduct.price,
      totalPrice: foundProduct.price * quantity,
    };

    let newCart = new Cart({
      customer,
      products: [newItem],
      cartTotal: 0,
    });
    // accumulation of all cart item's total price
    newCart.cartTotal = newCart.products.reduce(
      (acc, item) => (acc += item.totalPrice),
      0
    );

    await newCart.save();
    return res.status(200).json(newCart);
  } catch (err) {
    writeError(err);
    console.error(err);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${err.message}` });
  }
}

async function handleExistingCart(
  req,
  res,
  existCart,
  product,
  quantity,
  size
) {
  try {
    const foundProduct = await Product.findById(product);

    if (!foundProduct) {
      return res.status(400).send({ message: "Such product not found !" });
    }

    const currentStockQuantity = foundProduct.instock;
    const quantityToAdd = quantity;

    if (quantityToAdd > currentStockQuantity) {
      return res.status(400).send({
        message: `There are only ${currentStockQuantity} units for sale !`,
      });
    }

    // Check if the product is already in the cart with the same size
    let sameCartItem = existCart.products.find(
      (item) => item.product._id == foundProduct._id && item.size == size
    );

    // If the product is already in the cart, increment the quantity and update the total price
    if (sameCartItem) {
      sameCartItem.quantity += quantity;

      // Convert existing totalPrice to a Decimal object for accurate calculations
      sameCartItem.totalPrice = new Decimal(sameCartItem.totalPrice)
        .plus(new Decimal(foundProduct.price).times(quantity))
        .toNumber();
    }
    // If the product is not in the cart, add it as a new item
    else {
      const newItem = {
        product: foundProduct._id,
        quantity,
        size,
        price: foundProduct.price,
        // Convert totalPrice to a Decimal object for accurate calculations
        totalPrice: new Decimal(foundProduct.price).times(quantity).toNumber(),
      };
      existCart.products.push(newItem);
    }
    // Assuming totalPrice is in a decimal format (e.g., dollars)
    // Convert it to a Decimal object for accurate calculations
    existCart.cartTotal = existCart.products
      .reduce(
        (acc, item) => acc.plus(new Decimal(item.totalPrice)),
        new Decimal(0)
      )
      .toNumber();

    // Convert the total back to a decimal format for display
    existCart.cartTotal = existCart.cartTotal.toFixed(2);

    // // accumulation of all cart item's total price
    // existCart.cartTotal = existCart.products.reduce(
    //   (acc, item) => (acc += item.totalPrice),
    //   0
    // )

    await existCart.save();
    return res.status(200).json(existCart);
  } catch (err) {
    writeError(err);
    console.error(err);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${err.message}` });
  }
}

// Get all carts.
async function getCarts(req, res) {
  try {
    const carts = await Cart.find()
      .populate("customer", "fullname")
      .populate("products.product", "title");
    return res.status(200).json(carts);
  } catch (err) {
    writeError(err);
    console.error(err);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${err.message}` });
  }
}
// Get a cart by ID.
async function getCart(req, res) {
  if (!isValid(req.params.id)) {
    return res.status(400).send("Such cart not found !");
  }
  try {
    const cart = await Cart.aggregate([
      {
        $match: {
          customer: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: {
            id: "$products.product",
            size: "$products.size",
            cartTotal: "$cartTotal",
          },
          totalPrice: { $sum: "$products.totalPrice" },
          qty: { $sum: "$products.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id.id",
          foreignField: "_id",
          as: "populated",
        },
      },
      {
        $unwind: "$populated",
      },
      {
        $project: {
          // specifications
          _id: "$_id.id",
          title: "$populated.title",
          desc: "$populated.desc",
          size: "$populated.size",
          category: "$populated.category",
          img: "$populated.img",
          totalPrice: 1,
          quantity: "$qty",
          price: "$populated.price",
          cartTotal: "$_id.cartTotal",
        },
      },

      // {
      //   $group: {
      //     _id: {
      //       id: "$products.product",
      //       item: "$populated.title",
      //       desc: "$populated.desc",
      //       total: { $sum: "$products.totalPrice" },
      //       qty: { $sum: '$products.quantity' },
      //       img: "$populated.img",
      //       categ: "$populated.category",
      //       size: "$products.size",
      //       instock: "$populated.instock",
      //     },
      //   }
      // },
      // {
      //   $project: {
      //     _id: "$_id.id",
      //     product: "$_id.item",
      //     desc: "$_id.desc",
      //     img: "$_id.img",
      //     category: "$_id.categ",
      //     size: "$_id.size",
      //     quantity: '$_id.qty',
      //     instock: "$_id.instock",
      //     totalPrice: "$_id.total",
      //   }
      // },
    ]);

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
  if (!isValid(customer)) {
    return res.status(400).send("Such customer not found !");
  }
  try {
    const cart = await Cart.findOne({ customer });
    if (!cart) {
      return res.status(400).send({ message: "Your cart not found !" });
    }
    if (removeId) {
      return handleRemoveItem(req, res, cart, removeId);
    } else {
      return handleUpdateItem(req, res, customer, itemId, quantity, size, cart);
    }
  } catch (err) {
    writeError(err);
    console.error(err);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${err.message}` });
  }
}

async function handleRemoveItem(req, res, cart, removeId) {
  if (removeId && !isValid(removeId)) {
    return res.status(400).send("Such product not found in cart !");
  }
  try {
    cart.products = cart.products.filter(
      (product) => product.product != removeId
    );
    await cart.save();

    return res.status(200).json(cart.products);
  } catch (err) {
    writeError(err);
    console.error(err);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${err.message}` });
  }
}

async function handleUpdateItem(
  req,
  res,
  customer,
  itemId,
  quantity,
  size,
  cart
) {
  if (!isValid(itemId)) {
    return res.status(400).send("Product ID invalid !");
  }
  try {
    const productIndex = cart.products.findIndex(
      (item) => item.product == itemId
    );
    if (productIndex === -1) {
      return res.status(400).send({ message: "Product not found in cart !" });
    }

    let productPrice;
    const product = cart.products[productIndex];
    if (quantity && product.quantity !== quantity) {
      product.quantity = quantity;
      product.totalPrice = product.price * quantity;
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
      { new: true, runValidators: true, projection: { products: 1 } }
    );

    const updatedProduct = await Product.findById(itemId);
    if (!updatedProduct) {
      return res.status(400).send({ message: "Product not found !" });
    }

    if (quantity && quantity > updatedProduct.instock) {
      return res.status(400).send({
        message: `There are only ${updatedProduct.instock} units for sale !`,
      });
    }

    return res.status(200).json(existCart.products);
  } catch (err) {
    writeError(err);
    console.error(err);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${err.message}` });
  }
}
// Delete a cart.
async function deleteCart(req, res) {
  try {
    const existCart = await Cart.findOne({ customer: req.params.id }).populate(
      "customer",
      "fullname"
    );
    if (!existCart) {
      return res.status(400).send({ message: "Such cart not found !" });
    }
    existCart.products = [];
    existCart.cartTotal = 0;
    await existCart.save();
    return res.status(200).json(existCart);
  } catch (err) {
    writeError(err);
    console.error(err);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${err.message}` });
  }
}

module.exports = { addItemCart, getCarts, getCart, editCart, deleteCart };
