const { DB_NAME } = require("../utils/secrets");

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUSers = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NULL,
    lastname VARCHAR(50) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createNewUser = `
INSERT INTO users VALUES(null, ?, ?, ?, ?, ?, ?, NOW())
`;

const findUserByEmail = `
SELECT * FROM users WHERE email = ?
`;

const findUserById = `
SELECT * FROM users WHERE id = ?
`;

const findAdmin = `
SELECT * FROM users
`;

const updateProfile = `
UPDATE users SET firstname=?, lastname=?, email=? WHERE id = ?;
SELECT * FROM users WHERE id = ?;
`;

const updatePassword = `
UPDATE users SET password=? WHERE id = ?;
`;

const createNewBot = `
INSERT INTO bots VALUES(?, ?, ?, ?, null, ?, ?, NOW());
`;

const findByName = `
SELECT * FROM bots WHERE bot_name = ?
`;

const getAllTrainDataByBot = `
SELECT * FROM traindatas WHERE bot_id = ?
`;

const createTrainData = `
INSERT INTO traindatas VALUES(?, ?, ?, ?, ?, 0, ?, NOW());
`;

const delBotById = `
DELETE FROM bots WHERE id = ?
`;

const delTrainDataByBotid = `
SELECT id FROM traindatas WHERE bot_id = ?;
DELETE FROM traindatas WHERE bot_id = ?;
`;

const getTrainDataById = `
SELECT * FROM traindatas WHERE id = ?
`;

const delTrainDataById = `
DELETE FROM hoqs WHERE traindata_id = ?;
DELETE FROM mcqs WHERE traindata_id = ?;
DELETE FROM chunks WHERE traindata_id = ?;
DELETE FROM traindatas WHERE id = ?;
UPDATE traindatas SET is_trained = 0 WHERE bot_id = ?;
SELECT * FROM traindatas WHERE bot_id = ?;
`;

const delTrainDataByIdOnly = `
DELETE FROM hoqs WHERE traindata_id = ?;
DELETE FROM mcqs WHERE traindata_id = ?;
DELETE FROM chunks WHERE traindata_id = ?;
DELETE FROM traindatas WHERE id = ?;
`;

const getBotById = `
SELECT * FROM bots WHERE id = ?
`;

const changeIsTrainedById = `
UPDATE traindatas SET is_trained = ? WHERE id = ?;
`;

const getChunks = `
SELECT * FROM chunks WHERE traindata_id = ? AND level = ? AND isMCQ = ?;
`;

const createChunkRec = `
INSERT INTO chunks VALUES(NULL, ?, ?, ?, ?);
`;

const updateChunkRec = `
UPDATE chunks SET chunk_nums = ? WHERE traindata_id = ? AND level = ? AND isMCQ = ?;
`;

const delChunk = `
DELETE FROM chunks WHERE traindata_id = ? AND level = ? AND isMCQ = ?;;
`;

const changeBot = `
UPDATE bots SET bot_name=?, description=? WHERE id = ?;
`;

const isActive = `
SELECT COUNT(*) as cnt FROM traindatas WHERE bot_id=?
`;

const search = `
SELECT * FROM bots WHERE bot_name LIKE ? OR description LIKE ?;
`;

module.exports = {
  createDB,
  dropDB,
  createTableUSers,
  createNewUser,
  findUserByEmail,
  findUserById,
  findAdmin,
  updateProfile,
  updatePassword,
  createNewBot,
  findByName,
  getAllTrainDataByBot,
  createTrainData,
  delBotById,
  delTrainDataByBotid,
  getTrainDataById,
  delTrainDataById,
  getBotById,
  changeIsTrainedById,
  delTrainDataByIdOnly,
  getChunks,
  createChunkRec,
  updateChunkRec,
  delChunk,
  changeBot,
  isActive,
  search,
};
