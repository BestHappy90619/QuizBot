const db = require("../config/db.config");
const {
  getAllBots: getAllBotsQuery,
  createNewBot: createNewBotQuery,
  findByName: findByNameQuery,
  getAllTrainDataByBot: getAllTrainDataByBotQuery,
  createTrainData: createTrainDataQuery,
  delBotById: delBotByIdQuery,
  delTrainDataByBotid: delTrainDataByBotidQuery,
  getTrainDataById: getTrainDataByIdQuery,
  delTrainDataById: delTrainDataByIdQuery,
  delTrainDataByIdOnly: delTrainDataByIdOnlyQuery,
  getBotById: getBotByIdQuery,
  changeIsTrainedById: changeIsTrainedByIdQuery,
  getChunks: getChunksQuery,
  createChunkRec: createChunkRecQuery,
  updateChunkRec: updateChunkRecQuery,
  delChunk: delChunkQuery,
  changeBot: changeBotQuery,
  isActive: isActiveQuery,
  search: searchQuery,
} = require("../database/queries");
const { logger } = require("../utils/logger");

class Bot {
  static create(newBot, cb) {
    const insertId = new Date().getTime();
    db.query(
      createNewBotQuery,
      [
        insertId,
        newBot.bot_name,
        newBot.img_url,
        newBot.description,
        newBot.namespace,
        newBot.created_by,
      ],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        cb(null, {
          id: insertId,
          bot_name: newBot.bot_name,
          img_url: newBot.img_url,
          description: newBot.description,
          namespace: newBot.namespace,
        });
      }
    );
  }

  static findByName(name, cb) {
    db.query(findByNameQuery, name, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res.length) {
        cb(null, res);
        return;
      }
      cb(null, null);
    });
  }

  static getAllTrainDataByBot(bot_id, cb) {
    db.query(getAllTrainDataByBotQuery, bot_id, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res.length) {
        cb(null, res);
        return;
      }
      cb(null, null);
    });
  }

  static createTrainData(newTrainData, cb) {
    const newRecId = new Date().getTime();
    db.query(
      createTrainDataQuery,
      [
        newRecId,
        newTrainData.filename,
        newTrainData.originalname,
        newTrainData.doc_url,
        newTrainData.bot_id,
        newTrainData.user_id,
      ],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        cb(null, { id: newRecId });
      }
    );
  }

  static changeIsTrainedById(data, cb) {
    db.query(
      changeIsTrainedByIdQuery,
      [data.is_trained, data.id],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        cb(null, { message: "success" });
      }
    );
  }

  static delBotById(bot_id, cb) {
    db.query(delTrainDataByBotidQuery, [bot_id, bot_id], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      db.query(delBotByIdQuery, bot_id, (err1, res1) => {
        if (err1) {
          logger.error(err1.message);
          cb(err1, null);
          return;
        }
        if (res[0].length > 0) {
          let whereSection = " WHERE traindata_id = " + res[0][0].id;
          for (let i = 1; i < res[0].length; i++)
            whereSection += " OR " + res[0][i].id;
          whereSection += ";";
          let delHOQQuery = "DELETE FROM hoqs" + whereSection;
          let delMCQQuery = "DELETE FROM mcqs" + whereSection;
          let delChunkQuery = "DELETE FROM chunks" + whereSection;
          db.query(delHOQQuery + delMCQQuery + delChunkQuery, (err2, res2) => {
            if (err2) {
              logger.error(err2.message);
              cb(err2, null);
              return;
            }
            cb(null, { message: "Delete ChatBot successfully" });
          });
        } else cb(null, { message: "Delete ChatBot successfully" });
      });
    });
  }

  static getTrainDataById(data, cb) {
    db.query(getTrainDataByIdQuery, data, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res.length) {
        cb(null, res);
        return;
      }
      cb(null, null);
    });
  }

  static clearTrainDataByBotId(data, cb) {
    db.query(delTrainDataByBotidQuery, [data, data], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, { message: "Delete all TrainData successfully" });
    });
  }

  static delTrainDataById(data, cb) {
    if (data.is_trained)
      db.query(
        delTrainDataByIdQuery,
        [data.tid, data.tid, data.tid, data.tid, data.bid, data.bid],
        (err, res) => {
          if (err) {
            logger.error(err.message);
            cb(err, null);
            return;
          }
          if (res.length) {
            cb(null, res[5]);
            return;
          }
          cb(null, null);
        }
      );
    else
      db.query(
        delTrainDataByIdOnlyQuery,
        [data.tid, data.tid, data.tid, data.tid],
        (err, res) => {
          if (err) {
            logger.error(err.message);
            cb(err, null);
            return;
          }
          cb(null, { msg: "success" });
          return;
        }
      );
  }

  static getBotById(data, cb) {
    db.query(getBotByIdQuery, data, (err, res) => {
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

  static getAllQA(data, cb) {
    const plusMCQSearch = ` OR option_a LIKE "%${data.search}%" OR option_b LIKE "%${data.search}%" OR option_c LIKE "%${data.search}%" OR option_d LIKE "%${data.search}%"`;
    const trainDataSearch = ` AND traindata_id=${data.traindata_id}`;
    const countSelect = "SELECT COUNT(*) AS total";
    const getSelect = "SELECT *";
    const query = ` FROM ${data.isMCQ == 1 ? "mcqs" : "hoqs"} WHERE qlevel=${
      data.level
    }${data.traindata_id == -1 ? "" : trainDataSearch} AND (question LIKE "%${
      data.search
    }%" OR answer LIKE "%${data.search}%"${
      data.isMCQ == 1 ? plusMCQSearch : ""
    })`;
    const paginationQuery =
      data.selectedPagesize === -1
        ? ""
        : ` LIMIT ${data.selectedPagesize} OFFSET ${
            (data.selectedPage - 1) * data.selectedPagesize
          };`;
    db.query(countSelect + query, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res[0]?.total !== undefined) {
        db.query(getSelect + query + paginationQuery, (err, res1) => {
          if (err) {
            logger.error(err.message);
            cb(err, null);
            return;
          }
          if (res1.length > 0) {
            cb(null, { qas: res1, total: res[0].total });
            return;
          }
          cb(null, null);
        });
        return;
      }
      cb(null, null);
    });
  }

  static delQAById(data, cb) {
    let delQAByIdQuery = `DELETE FROM ${
      data.isMCQ == 1 ? "mcqs" : "hoqs"
    } WHERE id = ${data.id}`;
    db.query(delQAByIdQuery, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, { message: "success" });
    });
  }

  static resetQAbyTrainData(data, cb) {
    let resetQAbyTrainDataQuery = `
      DELETE FROM hoqs WHERE traindata_id = ${data.traindata_id};
      DELETE FROM mcqs WHERE traindata_id = ${data.traindata_id};
      DELETE FROM chunks WHERE traindata_id = ${data.traindata_id};
    `;
    db.query(resetQAbyTrainDataQuery, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, { message: "success" });
    });
  }

  static determineAction(data, cb) {
    let determineActionQuery = `
      SELECT * FROM chunks WHERE traindata_id = ${
        data.traindata_id
      } AND level = ${data.level} AND isMCQ = ${data.isMCQ};
      SELECT COUNT(*) as cnt FROM ${
        data.isMCQ == 1 ? "mcqs" : "hoqs"
      } WHERE traindata_id = ${data.traindata_id} AND qlevel = ${data.level};
    `;
    db.query(determineActionQuery, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, res);
    });
  }

  static getChunk(data, cb) {
    db.query(
      getChunksQuery,
      [data.traindata_id, data.level, data.isMCQ],
      (err, res) => {
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
      }
    );
  }

  static async createChunkRec(data, cb) {
    db.query(
      createChunkRecQuery,
      [data.newRecStr, data.level, data.isMCQ, data.traindata_id],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          return err;
        }
        return null;
      }
    );
  }

  static async updateChunkRec(data, cb) {
    db.query(
      updateChunkRecQuery,
      [data.updateRecStr, data.traindata_id, data.level, data.isMCQ],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          return err;
        }
        return null;
      }
    );
  }

  static async createQA(data, cb) {
    var query = "";
    if (data.isMCQ == 1) {
      for (let i = 0; i < data.qa.length; i++) {
        data.qa[i].options.map((option, index) => {
          if (option == data.qa[i].answer) {
            data.qa[i].answer = index + "";
            return;
          }
        });
        query += `INSERT INTO mcqs VALUES(NULL, "${data.qa[i].question}", "${data.qa[i].options[0]}", "${data.qa[i].options[1]}", "${data.qa[i].options[2]}", "${data.qa[i].options[3]}", "${data.qa[i].answer}", "${data.level}", "${data.traindata_id}");`;
      }
    } else {
      for (let i = 0; i < data.qa.length; i++)
        query += `INSERT INTO hoqs VALUES(NULL, "${data.qa[i].question}", "${data.qa[i].answer}", "${data.level}", "${data.traindata_id}");`;
    }
    db.query(query, (err, res) => {
      if (err) {
        logger.error(err.message);
        return err;
      }
      return null;
    });
  }

  static async delChunkRec(data, cb) {
    db.query(
      delChunkQuery,
      [data.traindata_id, data.level, data.isMCQ],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          return err;
        }
        return null;
      }
    );
  }

  static getQAById(data, cb) {
    let getQAByIdQuery = `SELECT * FROM ${
      data.isMCQ == 1 ? "mcqs" : "hoqs"
    } WHERE id = ${data.id}`;
    db.query(getQAByIdQuery, (err, res) => {
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

  static updateQAById(data, cb) {
    let updateQAQuery = "";
    if (data.isMCQ == 1)
      updateQAQuery = `UPDATE mcqs SET question="${data.updatedInfo.editQuestion}", qlevel="${data.updatedInfo.editSelectedLevel}", answer="${data.updatedInfo.editMCQAnswer}", option_a="${data.updatedInfo.editMCQOptionA}", option_b="${data.updatedInfo.editMCQOptionB}", option_c="${data.updatedInfo.editMCQOptionC}", option_d="${data.updatedInfo.editMCQOptionD}" WHERE id=${data.id};`;
    else
      updateQAQuery = `UPDATE hoqs SET question="${data.updatedInfo.editQuestion}", qlevel="${data.updatedInfo.editSelectedLevel}", answer="${data.updatedInfo.editCMAnswer}" WHERE id=${data.id};`;
    db.query(updateQAQuery, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, { message: "success" });
    });
  }

  static changeBot(data, cb) {
    db.query(
      changeBotQuery,
      [data.bot_name, data.description, data.id],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        cb(null, null);
        return;
      }
    );
  }

  static isActive(data, cb) {
    db.query(isActiveQuery, data, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, res[0].cnt);
      return;
    });
  }

  static search(data, cb) {
    const search = "%" + data + "%";
    db.query(searchQuery, [search, search], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, res);
      return;
    });
  }
}

module.exports = Bot;
