const yup = require('yup');
const writeError = require('../settings/BUG/bug');

const schema = yup.object({
    fullname: yup.string().required(),
    phone: yup.number().required(),
    img: yup.string().default(null),
    address: yup.string().required().min(2).max(100),
    balance: yup.number().default(null),
    role: yup.string().min(2).max(10).default('customer'),
    email: yup.string().required().email('invalid email address').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: yup.string().required().min(4).max(200)
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

module.exports = validation;