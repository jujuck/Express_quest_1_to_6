const crypto = require('crypto');
const { getMaxListeners } = require('process');

const PRIVATE_KEY = "MySuperPrivateKeyForMyQuest";

const calculateToken = (userEmail = "") => {
  return crypto.createHash('md5').update(userEmail + PRIVATE_KEY).digest("hex")
}

module.exports = { calculateToken };