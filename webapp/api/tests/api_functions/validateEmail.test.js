const file = require("../../api_functions.js")
const validateEmail = file.validateEmail


test('validates a valid email', () => {
  const validEmails = [
    'test@example.com',
    'john.doe@gmail.com',
    'info@mywebsite.net'
  ];
  
  for (const email of validEmails) {
    expect(validateEmail(email)).toBe(true);
  }
});
  
test('does not validate an invalid email', () => {
  const invalidEmails = [
    'notanemail',
    'user@',
    '@example.com',
    'user@example'
  ];
  
  for (const email of invalidEmails) {
    expect(validateEmail(email)).toBe(false);
  }
});

test('returns false for empty string', () => {
  const emptyString = '';
  expect(validateEmail(emptyString)).toBe(false);
});
  
test('returns false for array', () => {
  const array = ['test@example.com'];
  expect(validateEmail(array)).toBe(false);
});
  
test('returns false for integer', () => {
  const integer = 12345;
  expect(validateEmail(integer)).toBe(false);
});
  
test('returns false for float', () => {
  const float = 12.34;
  expect(validateEmail(float)).toBe(false);
});
  
test('returns false for boolean', () => {
  const bool = true;
  expect(validateEmail(bool)).toBe(false);
});
  
test('returns false for null', () => {
  const nullValue = null;
  expect(validateEmail(nullValue)).toBe(false);
});
  
test('returns false for undefined', () => {
  const undefinedValue = undefined;
  expect(validateEmail(undefinedValue)).toBe(false);
});