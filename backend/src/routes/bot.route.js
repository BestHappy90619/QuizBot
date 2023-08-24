const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { asyncHandler } = require("../middlewares/asyncHandler");
const botController = require("../controllers/bot.controller");

const Bot = require("../models/bot.model");

const { PUBLIC_URL } = require("../utils/secrets");

const storageImgWithValidator = multer.diskStorage({
  destination: (req, files, callBack) => {
    var namespace = 0;
    if (req.body.namespace === undefined) {
      namespace = new Date().getTime();
      req.body.namespace = namespace;
    } else namespace = req.body.namespace;

    var dir = path.join(__dirname, PUBLIC_URL + namespace);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    callBack(null, dir);
  },
  filename: (req, files, callBack) => {
    callBack(null, "index" + path.extname(files.originalname));
  },
});
let uploadImgWithValidator = multer({
  fileFilter: function (req, files, callback) {
    if (!req.body.bot_name || !req.body.description || files === undefined)
      return callback(new Error("Parameter Error"));
    if (req.body.namespace === undefined) {
      Bot.findByName(req.body.bot_name, (err, data) => {
        if (err) {
          return callback(new Error(err.message));
        } else {
          if (data == null) {
            var ext = path.extname(files.originalname);
            if (ext !== ".png") {
              return callback(new Error("Only .png is allowed"));
            }
            return callback(null, true);
          } else {
            return callback(new Error("Already Exists!"));
          }
        }
      });
    } else {
      console.log(req.body);
      if (req.body.noUploadedAvatar === "true") return callback(null, false);
      var ext = path.extname(files.originalname);
      if (ext !== ".png") {
        return callback(new Error("Only .png is allowed"));
      }
      return callback(null, true);
    }
  },
  storage: storageImgWithValidator,
});

const storageDoc = multer.diskStorage({
  destination: (req, file, callBack) => {
    var dir = path.join(
      __dirname,
      PUBLIC_URL + req.body.namespace + "/traindatas"
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    callBack(null, dir);
  },
  filename: (req, file, callBack) => {
    callBack(null, new Date().getTime() + path.extname(file.originalname));
  },
});
let uploadDoc = multer({
  fileFilter: function (req, files, callback) {
    if (
      req.body.namespace === undefined ||
      req.body.bot_id === undefined ||
      req.body.user_id === undefined ||
      files === undefined
    )
      return callback(new Error("Parameter Error"));
    var ext = path.extname(files.originalname);
    if (ext !== ".pdf" && ext !== ".docx" && ext !== ".txt") {
      return callback(new Error("Not Allowed file"));
    }
    callback(null, true);
  },
  storage: storageDoc,
});

router
  .route("/create")
  .post(
    [uploadImgWithValidator.single("file")],
    asyncHandler(botController.create)
  );

router.route("/getById").post(asyncHandler(botController.getBotById));

router.route("/isActive").post(asyncHandler(botController.isActive));

router.route("/delById").post(asyncHandler(botController.delBotById));

router
  .route("/change")
  .post(
    [uploadImgWithValidator.single("file")],
    asyncHandler(botController.changeBot)
  );

router.route("/getReply").post(asyncHandler(botController.getReply));

router.route("/search").post(asyncHandler(botController.search));

router
  .route("/traindata/getAll")
  .post(asyncHandler(botController.getAllTrainDataByBot));

router
  .route("/traindata/upload")
  .post(
    [uploadDoc.single("file")],
    asyncHandler(botController.uploadTrainData)
  );

router
  .route("/traindata/getById")
  .post(asyncHandler(botController.getTrainDataById));

router
  .route("/traindata/delById")
  .post(asyncHandler(botController.delTrainDataById));

router
  .route("/traindata/clearByBotId")
  .post(asyncHandler(botController.clearTrainDataByBotId));

router
  .route("/traindata/retrain")
  .post(asyncHandler(botController.retraindData));

router.route("/qa/getAll").post(asyncHandler(botController.getAllQA));

router.route("/qa/delById").post(asyncHandler(botController.delQAById));

router.route("/qa/reset").post(asyncHandler(botController.resetQAbyTrainData));

router.route("/qa/add").post(asyncHandler(botController.addQAbyTrainData));

router.route("/qa/getById").post(asyncHandler(botController.getQAById));

router.route("/qa/updateById").post(asyncHandler(botController.updateQAById));

module.exports = router;
