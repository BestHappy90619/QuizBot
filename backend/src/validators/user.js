const Joi = require("joi");
const validatorHandler = require("../middlewares/validatorHandler");

const contact = (req, res, next) => {
  const schema = Joi.object().keys({
    fromEmail: Joi.string().trim().email().required(),
    fromName: Joi.string().trim().min(2).max(50).required(),
    subject: Joi.string().trim().min(2).max(50).required(),
    description: Joi.string().trim().min(5).required(),
  });
  validatorHandler(req, res, next, schema);
};

module.exports = {
  contact,
};
