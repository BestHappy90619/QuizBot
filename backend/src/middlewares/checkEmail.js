const User = require("../models/user.model");

const checkEmail = (req, res, next) => {
  const { email } = req.body;
  User.findUserByEmail(email, (_, data) => {
    if (data) {
      res.status(409).send({
        status: "error",
        message: `A user with email address '${email}' already exits`,
      });
      return;
    }
    next();
  });
};

module.exports = checkEmail;
