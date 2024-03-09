const yup = require("yup");
const isValid = require("mongoose").Types.ObjectId.isValid;

// Schema
const paramsSchema = yup.object({
  id: yup.string().hex().length(24).required(),
});

const bodySchema = yup.object({
  code: yup.string().trim().required(),
  discountType: yup.string().default("percentage"),
  discountAmount: yup.number().required(),
  validFrom: yup.date().required(),
  validUntil: yup.date().required(),
  maxUses: yup.number(),
  currentUses: yup.number().default(0),
  isActive: yup.boolean().default(true),
});

// Validation functions
async function validateParams(req, res, next) {
  // Check the ID whether valid or invalid
  if (!isValid(req.params.id)) {
    return res.status(400).send({ message: "Invalid ID !" });
  }
  try {
    const { error, value } = await paramsSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error?.message });
    }
    // The params is valid, so you can continue
    next();
  } catch (err) {
    console.error(err);
    // The params is invalid, so you should send an error response
    res.status(400).json({ message: err?.message });
  }
}

async function validateBody(req, res, next) {
  const body = req.body;
  try {
    if (Object.keys(body).length == 0) {
      return res.status(400).send({ message: "Confirm something !" });
    }
    const { error, value } = await bodySchema.validate(body);
    if (error) {
      return res.status(400).json({ message: error?.message });
    }
    // The body is valid, so you can continue..
    next();
  } catch (err) {
    console.error(err);
    // The body is invalid, so you should send an error response
    res.status(400).json({ message: err?.message });
  }
}

module.exports = { validateParams, validateBody };
