const { sign } = require("jsonwebtoken");
const writeError = require("../settings/BUG/bug");

module.exports = (req, res) => {
  const validSecret = process.env.ADMIN_SECRET;
  const validPassword = process.env.ADMIN_PASSWORD;
  const { secret, password } = req.body;
  try {
    if ((secret != validSecret) | (password != validPassword)) {
      return res.status(400).send({ message: "Incorrect ⛔" });
    }
    const token = sign(
      {
        secret: validSecret,
        password: validPassword,
        role: "admin",
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    );
    return res.status(200).json({ jwt_token: token });
  } catch (err) {
    writeError(err);
    return res.status(400).send({ message: err?.message });
  }
};