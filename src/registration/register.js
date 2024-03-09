const Customer = require('../models/customer.model');
const CryptoJs = require('crypto-js');
const Jwt = require('jsonwebtoken');
const writeError = require('../settings/BUG/bug');

// REGISTER
async function registration(req, res) {
  const { phone, role } = req.body;
  try {
    const isExisted = await Customer.findOne({ phone });
    if (isExisted) {
      res.status(400).send({ message: 'Customer already exists !' });
      return;
    }

    const newCustomer = new Customer({
      phone,
      role
    });

    const token = Jwt.sign(
      {
        _id: newCustomer._id,
        phone: newCustomer.phone,
        role: newCustomer.role
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    );

    await newCustomer.save();

    let greeting;
    if (newCustomer.fullname == 'Unknown' || newCustomer.fullname == null) {
      greeting = 'welcome to our app 🎉'
    } else {
      greeting = `welcomeback ${newCustomer.fullname}`
    }
    return res.status(201).json({
      jwt_token: token,
      message: greeting
    });
  } catch (err) {
    writeError(err);
    res.status(400).send({ message: err.message });
  }
}

// LOGIN
async function authentication(req, res) {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).send({ message: 'Confirm something..' });
  }

  try {
    const existCustomer = await Customer.findOne({ phone });
    if (!existCustomer) {
      res.status(403).send({ message: 'You\'ve never signed up !' });
      return;
    }

    const accessToken = Jwt.sign(
      {
        _id: existCustomer._id,
        phone: existCustomer.phone,
        role: existCustomer.role
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    );

    let greeting;
    if (existCustomer.fullname == 'Unknown' || existCustomer.fullname == null) {
      greeting = 'welcomeback !'
    } else {
      greeting =`welcomeback ${existCustomer.fullname} !`
    }

    return res.status(200).json({
      jwt_token: accessToken,
      message: greeting
    });
  } catch (err) {
    writeError(err);
    res.status(400).send({ message: err.message });
  }
}

module.exports = { registration, authentication };