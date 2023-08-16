const CryptoJS = require('crypto-js');

function sha256HashPassword(password, salt) {
  if (typeof password !== 'string' || password.trim() === '' || typeof salt !== 'string' || salt.trim() === '') {
    throw new Error('Both password and salt must be non-empty strings');
  }
  const passwordWithSalt = password + salt;

  const hashedPassword = CryptoJS.SHA256(passwordWithSalt).toString();
  return hashedPassword;
}

module.exports = {
  sha256HashPassword,
};
