// File containing different functions used in different routes or API files
const argon2 = require('argon2');

function createNewObject(okPacket) {
  if (okPacket === null || okPacket === undefined || typeof okPacket !== 'object'|| Array.isArray(okPacket)) {
      return {};
  }

  const newObj = {};
  for (let [key, value] of Object.entries(okPacket)) {
      // If the value is a BigInt, transform to string
      if (typeof value === 'bigint') {
          value = value.toString();
      }
      newObj[key] = value;
  }
  return newObj;
}

  
  
function transformDate(date_to_transform, compare_date) {
  /**
   * Receives a date as an array and creates a new date array of the first date based on the current date retrieved by the system. The idea is to 
   * reposition the date received inside the system's date "frame". Figuring the time translation between compare_date and the current time to apply 
   * its translation to date_to_transform.
   * 
   * API and DB use GMT but by transforming the dates given by the probe to our "timeframe" we can easily addapt them to our timezone (as done here)
   */
  if (!Array.isArray(date_to_transform) || date_to_transform.length !== 6) {
      throw new Error('date_to_transform must be an array with 6 elements');
  }

  if (!Array.isArray(compare_date) || compare_date.length !== 6) {
      throw new Error('compare_date must be an array with 6 elements');
  }

  const current_date = new Date().toLocaleString('en-US', { timeZone: 'Europe/Brussels', hour12: false });
  const date_components = current_date.split(/[\/,: ]+/).map(component => parseInt(component));
  const [month, day, year, hour, minute, second] = date_components;
  const current_date_array = [year, month, day, hour, minute, second];

  const time_translation = current_date_array.map((elem, index) => elem - compare_date[index]);
  const transformed_date = date_to_transform.map((elem, index) => elem + time_translation[index]);

  return transformed_date;
}


async function hashPasswordWithArgon2(password) {
  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Password must be a non-empty string');
  }

  try {
    const hashed_password = await argon2.hash(password);
    return hashed_password;
  } catch (error) {
    console.error('Error hashing password with Argon2:', error.message);
    throw error;
  }
}


async function checkPasswordArgon2(hashed_password_with_salt, password) {
  if (typeof hashed_password_with_salt !== 'string' || hashed_password_with_salt.trim() === '') {
    throw new Error('Hashed password must be a non-empty string');
  }

  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Password must be a non-empty string');
  }

  try {
    const is_equal = await argon2.verify(hashed_password_with_salt, password);
    return is_equal;
  } catch (error) {
    throw new Error(error.message);
    throw error;
  }
}


function validateEmail(email) {
  if (typeof email !== 'string' || email.trim() === '') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}



module.exports = { createNewObject, transformDate, checkPasswordArgon2, hashPasswordWithArgon2, validateEmail };