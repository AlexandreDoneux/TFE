const CryptoJS = require('crypto-js');

function sha256HashPassword(password, salt) {
  const hashedPassword = CryptoJS.SHA256(password,salt).toString();
  return hashedPassword;
}

module.exports = {
  sha256HashPassword,
};
