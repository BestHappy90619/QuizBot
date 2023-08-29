const db = require("../config/db.config");
const {
    createNewOTP: createNewOTPQuery,
    findOTPByEmail: findOTPByEmailQuery,
    deleteOTP: deleteOTPQuery,
    updateOTP: updateOTPQuery
} = require("../database/queries");
const { logger } = require("../utils/logger");

class OTP {
    static create(newOTP, cb) {
        db.query(
          createNewOTPQuery,
          [newOTP.email, newOTP.otp, newOTP.exp],
          (err, res) => {
            if (err) {
              logger.error(err.message);
              cb(err, null);
              return;
            }
            cb(null, {
              id: res.insertId,
            });
          }
        );
      }

    static getByEmail(email, cb) {        
        db.query(findOTPByEmailQuery, email, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.length) {
                cb(null, res[0]);
                return;
            }
            cb(null, null);
        });
    }

    static delete(email, cb) {
        db.query(deleteOTPQuery, email, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            cb(null, { msg: "success" });
        });
    }

    static update(data, cb) {
        db.query(updateOTPQuery, [data.otp, data.exp, data.email], (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            cb(null, { msg: "success" });
        });
    }
}

module.exports = OTP;
