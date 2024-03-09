const yup = require('yup');
const writeError = require('../settings/BUG/bug');

const schema = yup.object({
    customer: yup.string().trim(),
    products: yup.array(),
    subtotal: yup.number(),
    tax: yup.number(),
    total: yup.number(),
    shippingAddress: yup.object(),
    billingAddress: yup.object(),
    status: yup.string().min(2).max(20).lowercase().default('new').trim(),
    paymentStatus: yup.string().min(2).max(20).lowercase().default('pending').trim(),
    paymentMethod: yup.string().min(2).max(20).lowercase().trim(),
    trackingNumber: yup.string(),
    discount: yup.number().default(0),
});

function validation () {
    return async (req, res, next) => {
        const body = req.body;
    
        try {
          const validatedBody = await schema.validate(body);
    
          // The body is valid, so you can now use it
          req.body = validatedBody;
          next();
        } catch (err) {
          writeError(err),
          // The body is invalid, so you should send an error response
          res.status(400).json({ message: err.message });
        }
    };
}

module.exports = { validation };