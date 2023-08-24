const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const { contact: contactValidator } = require("../validators/user");
const userController = require("../controllers/user.controller");

router
  .route("/contact")
  .post(contactValidator, asyncHandler(userController.contact));

module.exports = router;
