import { DEBUG_MODE } from "@/utils/global";
import http from "../utils/http";

const BOT_API = "/bot";

const create = (data) => {
  let formData = new FormData();
  formData.append("bot_name", data.bot_name);
  formData.append("description", data.description);
  formData.append("created_by", data.created_by);
  formData.append("file", data.file);

  return http
    .post(BOT_API + "/create", formData)
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

const getBotById = (id) => {
  return http
    .post(BOT_API + "/getById", { bot_id: id })
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

const delBotById = (data) => {
  return http
    .post(BOT_API + "/delById", data)
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

const change = (data) => {
  let formData = new FormData();
  formData.append("bot_name", data.bot_name);
  formData.append("description", data.description);
  formData.append("id", data.id);
  formData.append("namespace", data.namespace);
  formData.append("noUploadedAvatar", data.file.size === 0);
  formData.append("file", data.file);

  return http
    .post(BOT_API + "/change", formData)
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

const isActive = (bot_id) => {
  return http
    .post(BOT_API + "/isActive", { bot_id })
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

const getReply = (data) => {
  return http
    .post(BOT_API + "/getReply", data)
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

const searchBot = (data) => {
  return http
    .post(BOT_API + "/search", data)
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

const BotService = {
  create,
  getBotById,
  delBotById,
  change,
  isActive,
  getReply,
  searchBot,
};

export default BotService;
