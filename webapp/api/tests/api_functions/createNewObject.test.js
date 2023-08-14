const file = require("../../api_functions.js")
const createNewObject = file.createNewObject


test('transforms BigInt values to strings', () => {
  const input = {
    key1: 123,
    key2: BigInt(456),
    key3: 789n, // BigInt written another way ('n' at the end)
  };

  const result = createNewObject(input);

  expect(result.key1).toBe(123);
  expect(typeof result.key2).toBe('string');
  expect(result.key2).toBe('456');
  expect(typeof result.key3).toBe('string');
  expect(result.key3).toBe('789');
});

test('does not transform integers', () => {
  const input = {
    key1: 123,
    key2: 456,
  };

  const result = createNewObject(input);

  expect(result.key1).toBe(123);
  expect(result.key2).toBe(456);
  expect(typeof result.key1).toBe('number');
  expect(typeof result.key2).toBe('number');
});

test('does not transform floats', () => {
  const input = {
    key1: 123.45,
    key2: 6.789,
  };

  const result = createNewObject(input);

  expect(result.key1).toBe(123.45);
  expect(result.key2).toBe(6.789);
  expect(typeof result.key1).toBe('number');
  expect(typeof result.key2).toBe('number');
});

test('does not change values that are already strings', () => {
  const input = {
    key1: 'hello',
    key2: 'world',
  };
  
  const result = createNewObject(input);
  
  expect(result.key1).toBe('hello');
  expect(result.key2).toBe('world');
});
  
test('does not change values that are arrays', () => {
  const input = {
    key1: [1, 2, 3],
    key2: ['a', 'b', 'c'],
  };
  
  const result = createNewObject(input);
  
  expect(Array.isArray(result.key1)).toBe(true);
  expect(result.key1).toEqual([1, 2, 3]);
  expect(Array.isArray(result.key2)).toBe(true);
  expect(result.key2).toEqual(['a', 'b', 'c']);
});
  
test('does not change values that are booleans', () => {
  const input = {
    key1: true,
    key2: false,
  };
  
  const result = createNewObject(input);
  
  expect(result.key1).toBe(true);
  expect(result.key2).toBe(false);
});

test('handles an empty object', () => {
  const input = {};

  const result = createNewObject(input);
  expect(result).toEqual({});
});

// --------------------------------------------------------------------------------------------
// When parameters are not objects

test('handles null input', () => {
  const result = createNewObject(null);
  expect(result).toEqual({});
});

test('returns empty object for undefined parameter', () => {
  const result = createNewObject(undefined);
  expect(result).toEqual({});
});
  
test('returns empty object for a string parameter', () => {
  const result = createNewObject('test');
  expect(result).toEqual({});
});
  
test('returns empty object for an integer parameter', () => {
  const result = createNewObject(123);
  expect(result).toEqual({});
});
  
test('returns empty object for a float parameter', () => {
  const result = createNewObject(123.45);
  expect(result).toEqual({});
});
  
test('returns empty object for an array parameter', () => {
  const result = createNewObject([1, 2, 3]);
  expect(result).toEqual({});
});
  
test('returns empty object for a boolean parameter', () => {
  const result = createNewObject(true);
  expect(result).toEqual({});
});