import { DEBUG_MODE } from "@/utils/global";
import http from "../utils/http";
import { data } from "autoprefixer";

const QA_API = "/bot/qa";

const getQAs = (data) => {
  return http
    .post(QA_API + "/getAll", data)
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

const delQAById = (data) => {
  return http
    .post(QA_API + "/delById", data)
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

const getQAById = (data) => {
  return http
    .post(QA_API + "/getById", data)
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

const editQAById = (data) => {
  return http
    .post(QA_API + "/updateById", data)
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

const addQAs = (data) => {
  return http
    .post(QA_API + "/add", data)
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

const QAService = {
  getQAs,
  delQAById,
  getQAById,
  editQAById,
  addQAs,
};

export default QAService;
