const Joi = require("joi");
const validatorHandler = require("../middlewares/validatorHandler");

const signup = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    firstname: Joi.string().trim().alphanum().min(2).max(50).required(),
    lastname: Joi.string().trim().alphanum().min(2).max(50).required(),
    password: Joi.string()
      .trim()
      .min(6)
      .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,30}$"))
      .required(),
  });
  validatorHandler(req, res, next, schema);
};

const signin = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string()
      .trim()
      .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,30}$"))
      .required(),
  });
  validatorHandler(req, res, next, schema);
};

const updateProfile = (req, res, next) => {
  const schema = Joi.object().keys({
    id: Joi.required(),
    firstname: Joi.string().trim().alphanum().min(3).max(50).required(),
    lastname: Joi.string().trim().alphanum().min(3).max(50).required(),
    email: Joi.string().trim().email().required(),
  });
  validatorHandler(req, res, next, schema);
};

const updatePassword = (req, res, next) => {
  const schema = Joi.object().keys({
    id: Joi.required(),
    oldP: Joi.string()
      .trim()
      .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]"))
      .required(),
    newP: Joi.string()
      .trim()
      .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,30}$"))
      .required(),
  });
  validatorHandler(req, res, next, schema);
};

module.exports = {
  signup,
  signin,
  updateProfile,
  updatePassword,
};
