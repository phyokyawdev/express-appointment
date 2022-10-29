const bcrypt = require("bcrypt");

const hash = async (data) => {
  const hashedData = await bcrypt.hash(data, 10);
  return hashedData;
};

const compare = async (payload, data) => {
  const isValid = await bcrypt.compare(payload, data);
  return isValid;
};

module.exports = { hash, compare };
