const CryptoJS = require('crypto-js');

function hashPassword(password) {
  const hashedPassword = CryptoJS.SHA256(password).toString();
  return hashedPassword;
}

module.exports = {
  hashPassword,
};
