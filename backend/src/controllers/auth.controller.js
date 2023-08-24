const User = require("../models/user.model");
const {
  hash: hashPassword,
  compare: comparePassword,
} = require("../utils/password");
const { generate: generateToken } = require("../utils/token");

exports.signup = (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const hashedPassword = hashPassword(password.trim());

  const user = new User(
    firstname.trim(),
    lastname.trim(),
    email.trim(),
    hashedPassword
  );

  User.create(user, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      res.status(201).send({
        status: "success",
        data: data,
      });
    }
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findUserByEmail(email, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: "error",
          message: `The email was not found`,
        });
        return;
      }
      res.status(500).send({
        status: "error",
        message: err.message,
      });
      return;
    }
    if (data) {
      if (comparePassword(password.trim(), data.password)) {
        const token = generateToken(data.id);
        res.status(200).send({
          status: "success",
          data: {
            token,
            id: data.id,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            role: data.role,
            verify: data.verify,
            created_at: data.created_at,
          },
        });
        return;
      }
      res.status(401).send({
        status: "error",
        message: "Incorrect password",
      });
    }
  });
};

exports.updateProfile = (req, res) => {
  const { id, email, firstname, lastname } = req.body;
  User.updateProfile({ id, email, firstname, lastname }, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: "error",
          message: `The user was not found`,
        });
        return;
      }
      res.status(500).send({
        status: "error",
        message: err.message,
      });
      return;
    }
    if (data) {
      res.status(200).send({
        status: "success",
        data: {
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
        },
      });
      return;
    }
  });
};

exports.updatePassword = (req, res) => {
  const { id, oldP, newP } = req.body;
  User.findUserById(id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: "error",
          message: `The user was not found`,
        });
        return;
      }
      res.status(500).send({
        status: "error",
        message: err.message,
      });
      return;
    }
    if (data) {
      if (comparePassword(oldP.trim(), data.password)) {
        const hashedNewPwd = hashPassword(newP.trim());
        User.updatePassword({ id, hashedNewPwd }, (err, data) => {
          if (err)
            return res.status(500).send({
              status: "error",
              message: err.message,
            });
          if (data)
            return res.status(200).send({
              status: "success",
              data: {},
            });
        });
        return;
      }

      res.status(401).send({
        status: "error",
        message: "Incorrect old password",
      });
    }
  });
};
