const writeError = require("../../settings/BUG/bug");
const orderModel = require("../../models/order.model");
const cartModel = require("../../models/cart.model");
const customerModel = require("../../models/customer.model");
const promocodeModel = require("../../models/promocode.model");
const productModel = require("../../models/product.model");
const env = process.env;

async function payment(req, res) {
  const { customer, paymentMethod } = req.body;
  try {
    const validCustomer = await customerModel.findById(customer);
    const cart = await cartModel.findOne({ customer: customer });
    if (!cart) {
      return res.status(400).send({ message: "Grab something to purchase !" });
    }
    if (paymentMethod == "cash") {
      await inCash(req, res);
    } else {
      await withCard(req, res, cart, validCustomer);
    }
  } catch (err) {
    writeError(err);
    console.error(err);
    return res.status(500).send({ message: err?.message });
  }
}

async function inCash(req, res) {
  const { paymentMethod, paymentStatus, products } = req.body;
  try {
    // Extract productIds and quantities from the productsInCart array
    const productIds = products.map((item) => item._id);
    const quantities = products.map((item) => item.quantity);
    // Find the products based on their IDs
    const productsInDB = await productModel.find({ _id: { $in: productIds } });

    // Update each product's instock field based on quantities
    for (let i = 0; i < productsInDB.length; i++) {
      const product = productsInDB[i];
      const quantityToDecrement = quantities[i];

      // Assuming instock is a numeric field that can be decremented
      product.instock -= quantityToDecrement;

      // Save the updated product
      await product.save();
    }

    let totalTax = 0;
    const remainMoney = products.map((item) => {
      const subTotal = item.totalPrice - item.totalPrice * env.TAX;
      totalTax += item.totalPrice * env.TAX;
      return subTotal;
    });

    const paid = new orderModel({
      paymentMethod: paymentMethod || "cash",
      paymentStatus: paymentStatus || "paid",
      tax: env.TAX,
      subtotal: totalTax,
      total: remainMoney,
      products,
    });

    await paid.save();
    return res
      .status(200)
      .send({ message: "Payment in cash implemented successfully !" });
  } catch (err) {
    writeError(err);
    console.error(err);
    return res.status(500).send({ message: err?.message });
  }
}

async function withCard(req, res, cart, customer) {
  const { promocode } = req.body;
  try {
    if (promocode) {
      await discounting(req, res, cart, customer);
    } else {
      await discountLess(req, res, cart, customer);
    }
  } catch (err) {
    writeError(err);
    console.error(err);
    return res.status(500).send({ message: err?.message });
  }
}

async function discountLess(req, res, cart, customer) {
  const {
    paymentMethod,
    paymentStatus,
    products,
    shippingAddress,
    onePlace,
    status,
    trackingNumber,
  } = req.body;
  try {
    const totalPayment = products.reduce((acc, item) => {
      return (acc += item?.cartTotal);
    }, 0);

    if (customer.balance < totalPayment) {
      return res
        .status(400)
        .send({ message: "Lack of money in the balance !" });
    }

    // Extract productIds and quantities from the productsInCart array
    const productIds = products.map((item) => item._id);
    const quantities = products.map((item) => item.quantity);
    // Find the products based on their IDs
    const productsInDB = await productModel.find({ _id: { $in: productIds } });

    // Update each product's instock field based on quantities
    for (let i = 0; i < productsInDB.length; i++) {
      const product = productsInDB[i];
      const quantityToDecrement = quantities[i];

      // Assuming instock is a numeric field that can be decremented
      product.instock -= quantityToDecrement;

      // Save the updated product
      await product.save();
    }

    let totalTax = 0;
    const remainMoney = products.map((item) => {
      const subTotal = item.totalPrice - item.totalPrice * env.TAX;
      totalTax += item.totalPrice * env.TAX;
      return subTotal;
    });
    const paid = new orderModel({
      customer: customer._id,
      products,
      subtotal: totalTax,
      tax: env.TAX,
      total: remainMoney,
      shippingAddress: shippingAddress || "home",
      billingAddress: onePlace ? shippingAddress : billingAddress,
      status: status || "new",
      paymentStatus: paymentStatus || "pending",
      paymentMethod,
      trackingNumber,
    });

    cart.products = [];
    await cart.save();

    await paid.save();
    return res
      .status(200)
      .send({
        message: `Payment in ${paymentMethod} implemented successfully !`,
      });
  } catch (err) {
    writeError(err);
    console.error(err);
    return res.status(500).send({ message: err?.message });
  }
}

async function discounting(req, res, cart, customer) {
  const {
    paymentMethod,
    paymentStatus,
    products,
    shippingAddress,
    onePlace,
    status,
    trackingNumber,
    promocode,
  } = req.body;
  try {
    const validPromocode = await promocodeModel.findOne({ code: promocode });
    if (!validPromocode || !validPromocode.isActive) {
      return res.status(400).send({ message: "Invalid promocode !" });
    }
    const currentDate = new Date();

    if (
      (currentDate < validPromocode.validFrom) ||
      (currentDate > validPromocode.validUntil)
    ) {
      return res
        .status(400).send({ message: "Promo code is not valid at this time !" });
    }

    if (
      (validPromocode.maxUses !== null) &&
      (validPromocode.currentUses >= validPromocode.maxUses)
    ) {
      return res
        .status(400).json({ message: "Promo code has reached its usage limit !" });
    }

    // Update promo code usage count in the database
    validPromocode.currentUses++;
    await validPromocode.save();

    const totalPayment = products.reduce((acc, item) => {
      return (acc += item?.cartTotal);
    }, 0);

    if (customer.balance < totalPayment) {
      return res
        .status(400).send({ message: "Lack of money in the balance !" });
    }

    // Extract productIds and quantities from the productsInCart array
    const productIds = products.map((item) => item._id);
    const quantities = products.map((item) => item.quantity);
    // Find the products based on their IDs
    const productsInDB = await productModel.find({ _id: { $in: productIds } });

    // Update each product's instock field based on quantities
    for (let i = 0; i < productsInDB.length; i++) {
      const product = productsInDB[i];
      const quantityToDecrement = quantities[i];

      // Assuming instock is a numeric field that can be decremented
      product.instock -= quantityToDecrement;

      // Save the updated product
      await product.save();
    }

    let totalTax = 0;
    const remainMoney = products.map((item) => {
      const subTotal = item.totalPrice - item.totalPrice * env.TAX;
      totalTax += item.totalPrice * env.TAX;
      return subTotal;
    });

    const paid = new orderModel({
      customer: customer._id,
      products,
      subtotal: totalTax,
      tax: env.TAX,
      total: remainMoney,
      shippingAddress: shippingAddress || "home",
      billingAddress: onePlace ? shippingAddress : billingAddress,
      status: status || "new",
      paymentStatus: paymentStatus || "pending",
      paymentMethod,
      trackingNumber,
      discount: validPromocode.discountAmount,
    });

    cart.products = [];
    await cart.save();

    await paid.save();

    return res
      .status(200)
      .send({ message: `Payment in ${paymentMethod} implemented successfully !` });
  } catch (err) {
    writeError(err);
    console.error(err);
    return res.status(500).send({ message: err?.message });
  }
}

module.exports = payment;