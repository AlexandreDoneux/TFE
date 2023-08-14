const file = require("../../api_functions.js")
const hashPasswordWithArgon2 = file.hashPasswordWithArgon2
const checkPasswordArgon2 = file.checkPasswordArgon2

//// Check a argon2 hash on the same password is different (it is possible but extremely unlikely -> almost impossible)
test('generates different hashes for the same password', async () => {
  const password = 'mySecurePassword123';
  
  const hash1 = await hashPasswordWithArgon2(password);
  const hash2 = await hashPasswordWithArgon2(password);
  
  expect(hash1).not.toBe(hash2);
});

test('generates and verifies password hash', async () => {
  const password = 'mySecurePassword123';
  
  // Generate hash using hashPasswordWithArgon2
  const hashedPassword = await hashPasswordWithArgon2(password);
  
  // Verify hashed password using checkPasswordArgon2
  const isPasswordValid = await checkPasswordArgon2(hashedPassword, password);
  
  expect(isPasswordValid).toBe(true);
});


// the hash of a password with argon needs to start with a "$" -> other rules/obligations ? => see later
test('hashPasswordWithArgon2 returns a hash starting with "$"', async () => {
  const password = 'mySecurePassword123';
  const hashedPassword = await hashPasswordWithArgon2(password);
  
  expect(typeof hashedPassword).toBe('string');
  expect(hashedPassword.startsWith('$')).toBe(true);
});


// testing for non valide types of parameters 
test('hashPasswordWithArgon2 throws an error for integer password', async () => {
  await expect(hashPasswordWithArgon2(123)).rejects.toThrow('Password must be a non-empty string');
});

test('hashPasswordWithArgon2 throws an error for float password', async () => {
  await expect(hashPasswordWithArgon2(12.34)).rejects.toThrow('Password must be a non-empty string');
});

test('hashPasswordWithArgon2 throws an error for array password', async () => {
  await expect(hashPasswordWithArgon2(['array', 'of', 'strings'])).rejects.toThrow('Password must be a non-empty string');
});

test('hashPasswordWithArgon2 throws an error for object password', async () => {
  await expect(hashPasswordWithArgon2({ key: 'value' })).rejects.toThrow('Password must be a non-empty string');
});

test('hashPasswordWithArgon2 throws an error for null password', async () => {
  await expect(hashPasswordWithArgon2(null)).rejects.toThrow('Password must be a non-empty string');
});

test('hashPasswordWithArgon2 throws an error for undefined password', async () => {
  await expect(hashPasswordWithArgon2(undefined)).rejects.toThrow('Password must be a non-empty string');
});

test('hashPasswordWithArgon2 throws an error for empty string password', async () => {
  await expect(hashPasswordWithArgon2('')).rejects.toThrow('Password must be a non-empty string');
});

test('hashPasswordWithArgon2 throws an error for tuple password', async () => {
  await expect(hashPasswordWithArgon2([2023, 8, 14, 12, 0, 0])).rejects.toThrow('Password must be a non-empty string');
});


test('checkPasswordArgon2 throws an error for invalid password (string but not beginning with "$")', async () => {
  //await expect(checkPasswordArgon2("hashedPassword", "password")).rejects.toThrow('Error verifying password with Argon2: pchstr must contain a $ as first char'); -> mauvais
  await expect(checkPasswordArgon2("hashedPassword", "password")).rejects.toThrow('pchstr must contain a $ as first char'); // -> bon mais il raise/affiche quand même l'erreur en console
});
  

test.each([
  [123],
  [12.34],
  [['array', 'of', 'strings']],
  [{ key: 'value' }],
  [null],
  [undefined],
  [''],
  [[2023, 8, 14, 12, 0, 0]]
])(
  'checkPasswordArgon2 throws an error for invalid hashed password (type)',
  async (hashedPassword) => {
    const validPassword = 'myPassword123';
    await expect(checkPasswordArgon2(hashedPassword, validPassword)).rejects.toThrow('Hashed password must be a non-empty string');
  }
);
  
test.each([
  [123],
  [12.34],
  [['array', 'of', 'strings']],
  [{ key: 'value' }],
  [null],
  [undefined],
  [''],
  [[2023, 8, 14, 12, 0, 0]]
])(
  'checkPasswordArgon2 throws an error for invalid password (type)',
  async (password) => {
    const validHashedPassword = await hashPasswordWithArgon2('myPassword123');
    await expect(checkPasswordArgon2(validHashedPassword, password)).rejects.toThrow('Password must be a non-empty string');
  }
);
  
  