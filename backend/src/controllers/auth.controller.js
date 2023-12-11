const otpGenerator = require('otp-generator')

const User = require("../models/user.model");
const Token = require("../models/token.model");
const {
  hash: hashPassword,
  compare: comparePassword,
} = require("../utils/password");
const { generate: generateToken, decode: decodeToken } = require("../utils/token");

const Mailer = require("../utils/mailer");
const { MAILER_USER, SELF_URL } = require("../utils/secrets");
const { decode } = require("jsonwebtoken");
const OTP = require("../models/otp.model");

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
      const token = generateToken(data, "15h");
      Token.create({user_id: data.id, token}, async (err1, data1) => {
        if (err1) {
          res.status(500).send({
            status: "error",
            message: err1.message,
          });
        } else {
          const data = {
            from: MAILER_USER,
            to: email,
            subject: "Welcome to Quizbot",
            html:`<p>This link is to verify your email on QuizBot.com</p><p>Enjoy your QuizBot with just clicking this link </p><br /><a href="${SELF_URL}/verify?token=${token}">${SELF_URL}/verify?token=${token}</a>`
          };
          const result = await Mailer.send(data);
          res.status(201).send({
            status: "success",
            data: data,
          });
        }
      })
    }
  });
};

exports.verify = (req, res) => {
  let { token } = req.params;
  if (token === undefined || token === "")
    return res.status(400).json({ message: "Parameter Error" });
  let jsonToken = decodeToken(token);
  Token.getByUserId(jsonToken.id, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
      return;
    }
    if (data) {
      if(jsonToken.exp * 1000 < new Date().getTime()){
        res.status(408).send({
          status: "expired",
          message: "timeout"
        })
      } else {
        User.setVerified({verified: 1, id: jsonToken.id}, (err, data) => {
          if(err) {
            res.status(500).send({
              status: "error",
              message: err.message,
            });
            return;
          }
          if (data) {
            Token.delete(token, (err, data) => {
              if(err) {
                res.status(500).send({
                  status: "error",
                  message: err.message,
                });
                return;
              }
              if(data) {
                res.status(200).send({
                  status: "success",
                  message: "email verification success!"
                })
              }
            })
          }
        })
      }
    } else {
      res.status(404).send({
        status: "error",
        message: "token not exist"
      })
    }
  })
}

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
        if (data.verified){
          const token = generateToken({ id: data.id}, "1h");
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
        } else
          Token.getByUserId(data.id, async (err, data1) => {
            if (err) {
              res.status(500).send({
                status: "error",
                message: err.message,
              });
              return;
            }
            var token = "";
            if (data1?.length) {
              const jsonToken = decodeToken(data1[0].token);
              if(jsonToken.exp*1000 < new Date().getTime()*10){
                delete jsonToken.iat;
                delete jsonToken.exp;
                token = generateToken(jsonToken, "15h");
                Token.update({token, id: jsonToken.id}, (err, res) => {
                  if(err){
                    res.status(500).send({
                      status: "error",
                      message: err.message,
                    });
                    return;
                  }
                });
              } else token = data1[0].token;
            } else {
              token = generateToken({
                id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
              }, "15h");
              Token.create({user_id: data.id, token}, (err, res) => {
                if(err){
                  res.status(500).send({
                    status: "error",
                    message: err.message,
                  });
                  return;
                }
              });
            }
            const emailData = {
              from: MAILER_USER,
              to: email,
              subject: "Welcome to Quizbot",
              html:`<p>This link is to verify your email on QuizBot.com</p><p>Enjoy your QuizBot with just clicking this link </p><br /><a href="${SELF_URL}/verify?token=${token}">${SELF_URL}/verify?token=${token}</a>`
            };
            const result = await Mailer.send(emailData);
            res.status(403).send({
              status: "success",
              data: {
                msg: "Verify your Email!"
              },
            });
            return;
          })
      } else 
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

exports.getOTP = (req, res) => {
  const {email} = req.body;
  if(email === undefined)
    return res.status(400).send({ msg: "Wrong Request!" });
  User.findUserByEmail(email, (err, user) => {
    if(err){
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
    if (user) {
      OTP.getByEmail(email, async (err, otp) => {
        if(err){
          res.status(500).send({
            status: "error",
            message: err.message,
          });
          return;
        }
        var newOTP = "";
        var newExp = "";
        if(otp) {
          if(otp.exp < new Date().getTime()) {
            newOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
            newExp = new Date().getTime() + 15*3600*1000;
            OTP.update({otp: newOTP, exp: newExp, email}, (err, data) => {
              if(err){
                res.status(500).send({
                  status: "error",
                  message: err.message,
                });
                return;
              }
            })
          } else {
            newOTP = otp.otp;
            newExp = otp.exp;
          }
        } else {
          newOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
          newExp = new Date().getTime() + 15*3600*1000;
          OTP.create({otp: newOTP, exp: newExp, email}, (err, data) => {
            if(err){
              res.status(500).send({
                status: "error",
                message: err.message,
              });
              return;
            }
          })
        }
        const emailData = {
          from: MAILER_USER,
          to: email,
          subject: "Welcome to Quizbot",
          html: `<p>It looks like you forgot your password.</p><p>Don't worry. You can reset the password with the following code.</p><br /><p>${newOTP}</p>`
        };
        const result = await Mailer.send(emailData);
        res.status(200).send({
          status: "success",
          data: {
            msg: "Get the code from your inbox."
          },
        });
        return;
      });
    }
  });
}

exports.submitOTP = (req, res) => {
  const { email, otp } = req.body;
  if(email === undefined || otp === undefined)
    return res.status(400).send({ msg: "Wrong Request!" });
  OTP.getByEmail(email, async (err, otpRec) => {
    if(err){
      res.status(500).send({
        status: "error",
        message: err.message,
      });
      return;
    }
    if(otpRec) {
      if(otp == otpRec.otp) {
        if(otpRec.exp > new Date().getTime()){
          OTP.delete(email, (err, data) => {
            if(err){
              res.status(500).send({
                status: "error",
                message: err.message,
              });
              return;
            }
            res.status(200).send({
              status: "success",
              message: `success`,
            });
            return;
          })
        } else {
          res.status(406).send({
            status: "error",
            message: `Expired code!`,
          });
          return;
        }
      } else {
        res.status(401).send({
          status: "error",
          message: `Incorrect code!`,
        });
        return;
      }
    } else {
      res.status(404).send({
        status: "error",
        message: `An otp for the email was not found`,
      });
      return;
    }
  })
}

exports.resetPassword = (req, res) => {
  const { email, pwd } = req.body;
  const hashedNewPwd = hashPassword(pwd.trim());
  User.resetPassword({ email, hashedNewPwd }, (err, data) => {
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