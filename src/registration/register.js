const Customer = require('../models/customer.model');
const CryptoJs = require('crypto-js');
const Jwt = require('jsonwebtoken');
const writeError = require('../settings/BUG/bug');

// REGISTER
async function registration(req, res) {
  const { fullname, phone, img, address, balance, role, email, password } = req.body;
  try {
    const isExisted = await Customer.findOne({ email });
    if (isExisted) {
      res.status(400).send({ message: 'Customer already exists !' });
      return;
    }

    const deservePswd = await CryptoJs.AES.encrypt(password, process.env.CRYPTO_HASH_SECRET).toString();
    const newCustomer = new Customer({
      fullname,
      phone,
      img,
      address,
      balance,
      role,
      email,
      password: deservePswd
    });

    const token = Jwt.sign(
      {
        _id: newCustomer._id,
        fullname: newCustomer.fullname,
        phone: newCustomer.phone,
        img: newCustomer.img,
        address: newCustomer.address,
        email: newCustomer.email,
        balance: newCustomer.balance,
        role: newCustomer.role
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    );

    await newCustomer.save();
    return res.status(201).json({
      jwt_token: token,
      message: `welcome ${newCustomer.fullname} to our app !`
    });
  } catch (err) {
    writeError(err);
    res.status(400).send({ message: err.message });
  }
}

// LOGIN
async function authentication(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Type something..' });
  }

  try {
    const existCustomer = await Customer.findOne({ email });
    if (!existCustomer) {
      res.status(403).send({ message: 'You\'ve never signed up !' });
      return;
    }

    const hashedPswd = await CryptoJs.AES.decrypt(existCustomer.password, process.env.CRYPTO_HASH_SECRET);
    const existPswd = hashedPswd.toString(CryptoJs.enc.Utf8);
    if (existPswd !== password) {
      res.status(401).send({ message: 'Wrong credentials !' });
      return;
    }

    const accessToken = Jwt.sign(
      {
        _id: existCustomer._id,
        fullname: existCustomer.fullname,
        phone: existCustomer.phone,
        img: existCustomer.img,
        address: existCustomer.address,
        email: existCustomer.email,
        balance: existCustomer.balance,
        role: existCustomer.role
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    );

    return res.status(200).json({
      message: `welcomeback ${existCustomer.fullname}`,
      token: accessToken
    });
  } catch (err) {
    writeError(err);
    res.status(400).send({ message: err.message });
  }
}

module.exports = { registration, authentication };