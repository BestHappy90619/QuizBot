import { DEBUG_MODE } from "@/utils/global";
import http from "../utils/http";

const TRAINING_API = "/bot/traindata";

const getAllTrainDataByBot = (bot_id) => {
  return http
    .post(TRAINING_API + "/getAll", { bot_id })
    .then(
      (res) => {
        return res;
      },
      (err) => {
        if (!DEBUG_MODE) console.clear();
        return err.response;
      }
    )
    .catch((err) => {
      return err;
    });
};

const uploadData = (data) => {
  let formData = new FormData();
  formData.append("namespace", data.namespace);
  formData.append("bot_id", data.bot_id);
  formData.append("user_id", data.user_id);
  formData.append("file", data.file);
  return http
    .post(TRAINING_API + "/upload", formData)
    .then(
      (res) => {
        return res;
      },
      (err) => {
        if (!DEBUG_MODE) console.clear();
        return err.response;
      }
    )
    .catch((err) => {
      return err;
    });
};

const delTrainDataById = (data) => {
  return http
    .post(TRAINING_API + "/delById", data)
    .then(
      (res) => {
        return res;
      },
      (err) => {
        if (!DEBUG_MODE) console.clear();
        return err.response;
      }
    )
    .catch((err) => {
      return err;
    });
};

const clearTrainDataByBotId = (data) => {
  return http
    .post(TRAINING_API + "/clearByBotId", data)
    .then(
      (res) => {
        return res;
      },
      (err) => {
        if (!DEBUG_MODE) console.clear();
        return err.response;
      }
    )
    .catch((err) => {
      return err;
    });
};

const retraindData = (data) => {
  return http
    .post(TRAINING_API + "/retrain", data)
    .then(
      (res) => {
        return res;
      },
      (err) => {
        if (!DEBUG_MODE) console.clear();
        return err.response;
      }
    )
    .catch((err) => {
      return err;
    });
};

const TrainingService = {
  getAllTrainDataByBot,
  uploadData,
  delTrainDataById,
  clearTrainDataByBotId,
  retraindData,
};

export default TrainingService;
