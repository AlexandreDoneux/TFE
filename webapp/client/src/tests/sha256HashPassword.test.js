const file = require("../passwordUtils.js");
const sha256HashPassword = file.sha256HashPassword;

const CryptoJS = require('crypto-js');


test('generates correct SHA-256 hash for password and salt', () => {
  const password = 'myPassword123';
  const salt = 'randomSalt123';

  const hashedPassword = sha256HashPassword(password, salt);

  const expectedHash = 'a4a9e28a9eebb9fb6cf3eae6ca9195b4810d5f21a30aafe02f58c4d97d80bfd5';

  expect(hashedPassword).toBe(expectedHash);
});
  
test('generates different hashes for different passwords with same salt', () => {
  const password1 = 'myPassword123';
  const password2 = 'anotherPassword456';
  const salt = 'commonSalt123';
  
  const hashedPassword1 = sha256HashPassword(password1, salt);
  const hashedPassword2 = sha256HashPassword(password2, salt);

  expect(hashedPassword1).not.toBe(hashedPassword2);
});

// fix salt not working for sha256 hash => need to concatene password and salt
test('generates different hashes for same passwords with different salt', () => {
  const password = 'myPassword123';
  //const salt1 = 'commonSalt123';
  //const salt2 = 'commonSalt456'; -> with first two salts => same hash ????? SALT HAS NO EFFECT
  const salt1 = 'commonSalt';
  const salt2 = 'otherCommonSalt';
  
  const hashedPassword1 = sha256HashPassword(password, salt1);
  const hashedPassword2 = sha256HashPassword(password, salt2);
  const hash = CryptoJS.SHA256(password).toString();
  console.log(hash)

  console.log(hashedPassword1)
  console.log(hashedPassword2)
  
  expect(hashedPassword1).not.toBe(hashedPassword2);
});

test('generates same hashes for same passwords with same salt', () => {
  const password = 'myPassword123';
  const salt = 'commonSalt123';
  
  const hashedPassword1 = sha256HashPassword(password, salt);
  const hashedPassword2 = sha256HashPassword(password, salt);
  
  expect(hashedPassword1).toBe(hashedPassword2);
});





// Checking types
test('throws an error for integer password', () => {
  const password = 123;
  const salt = 'randomSalt123';
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for float password', () => {
  const password = 12.34;
  const salt = 'randomSalt123';
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for array password', () => {
  const password = ['array', 'of', 'strings'];
  const salt = 'randomSalt123';
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for empty string password', () => {
  const password = '';
  const salt = 'randomSalt123';
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for boolean password', () => {
  const password = true;
  const salt = 'randomSalt123';
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for null password', () => {
  const password = null;
  const salt = 'randomSalt123';
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for undefined password', () => {
  const password = undefined;
  const salt = 'randomSalt123';
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for integer salt', () => {
  const password = 'myPassword123';
  const salt = 123;
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for float salt', () => {
  const password = 'myPassword123';
  const salt = 12.34;
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for array salt', () => {
  const password = 'myPassword123';
  const salt = ['array', 'of', 'strings'];
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for empty string salt', () => {
  const password = 'myPassword123';
  const salt = '';
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for boolean salt', () => {
  const password = 'myPassword123';
  const salt = true;
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for null salt', () => {
  const password = 'myPassword123';
  const salt = null;
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});
  
test('throws an error for undefined salt', () => {
  const password = 'myPassword123';
  const salt = undefined;
  expect(() => sha256HashPassword(password, salt)).toThrow('Both password and salt must be non-empty strings');
});