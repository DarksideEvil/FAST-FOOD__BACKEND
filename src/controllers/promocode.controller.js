const promocodeModel = require("../models/promocode.model");
const writeError = require("../settings/BUG/bug");

async function addPromocode(req, res) {
  try {
    const newPromocode = await promocodeModel.create(req.body);
    return res.status(200).json(newPromocode);
  } catch (err) {
    writeError(err);
    return res.status(500).send({ message: err?.message });
  }
}

async function getPromocodes(req, res) {
  try {
    const promocodes = await promocodeModel.find();
    return res.status(200).json(promocodes);
  } catch (err) {
    writeError(err);
    return res.status(500).send({ message: err?.message });
  }
}

async function getPromocode(req, res) {
  try {
    const promocode = await promocodeModel.findById(req.params.id);
    return res.status(200).json(promocode);
  } catch (err) {
    writeError(err);
    return res.status(500).send({ message: err?.message });
  }
}

async function editPromocode(req, res) {
  try {
    const updatedPromo = await promocodeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedPromo);
  } catch (err) {
    writeError(err);
    return res.status(500).send({ message: err?.message });
  }
}

async function deletePromocode(req, res) {
  try {
    const deletedPromo = await promocodeModel.findByIdAndDelete(req.params.id);
    return res.status(200).json(deletedPromo);
  } catch (err) {
    writeError(err);
    return res.status(500).send({ message: err?.message });
  }
}

module.exports = {
  addPromocode,
  getPromocodes,
  getPromocode,
  editPromocode,
  deletePromocode
};
