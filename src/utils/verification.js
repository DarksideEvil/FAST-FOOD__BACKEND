const { verify } = require('jsonwebtoken');
const writeError = require('../settings/BUG/bug');

module.exports = async (req, res, next) => {
  const headerToken = req.headers['authorization'];
  
  if (!headerToken) {
    return res.status(400).send({ message: 'Token is needed!' });
  }
  
  try {
    const validToken = await verify(headerToken, process.env.TOKEN_SECRET);
    if (!validToken) {
        return res.status(400).send({ message: 'Invalid token!' });
    }
      next();
  } catch (err) {
    writeError(err);
    return res.status(400).send({ message: err?.message });
  }
};