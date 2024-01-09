const yup = require('yup');
const writeError = require('../settings/BUG/bug');

const schema = yup.object({
    title: yup.string().trim().uppercase().min(2).max(80).required(),
    desc: yup.string().max(500).required(),
    img: yup.string().trim().required(),
    category: yup.string().min(2).max(20).lowercase().required(),
    size: yup.string().min(2).max(20).lowercase().required(),
    instock: yup.number().required(),
    price: yup.number().required()
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