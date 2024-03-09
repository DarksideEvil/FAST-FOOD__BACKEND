const { string, number, object, array } = require("yup");
const writeError = require("../settings/BUG/bug");

const schema = object({
  customer: string().trim().required(),
  products: array(),
  cartTotal: number().default(0),
});

function validation() {
  return async (req, res, next) => {
    const body = req.body;
    try {
      const validatedBody = await schema.validate(body);

      // The body is valid, so you can now use it
      req.body = validatedBody;
      next();
    } catch (err) {
      writeError(err);
      console.error(err);
      // The body is invalid, so you should send an error response
      res.status(400).json({ message: err.message });
    }
  };
}

module.exports = { validation };
