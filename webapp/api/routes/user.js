const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');

const { createNewObject, transformDate, validateEmail, hashPasswordWithArgon2, checkPasswordArgon2  } = require("../api_functions.js");
var SHA256 = require("crypto-js/sha256");


// used to see what a password would look like after a sha256 hash with fixed salt and
// a argon2 hash with random salt
router.post('/print_password', async (req, res) => {
  const { password } = req.body;
  
  let conn;
  try {
    const passwordWithSalt = password + '9mtZy9IbOBNYz8x1FsHiHw==';
    const sha256_password = SHA256(passwordWithSalt).toString();
    const new_password = await hashPasswordWithArgon2(sha256_password)
    res.status(200).json({password, sha256_password, new_password});

  } catch (error) {
    throw error;
    //res.send("error") //send error and not throw error -> later
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});


router.post('/register', async (req, res) => {
  const { user_email, password } = req.body;
  
  // check if password matches stored password inside database
  let conn;
  try {
    // USER REGISTER CODE HERE

  } catch (error) {
    throw error;
    //res.send("error") //send error and not throw error -> later
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});



router.post('/connect', async (req, res) => {
  const { user_email, password } = req.body;
  const conn = await pool.getConnection();
  const session_id = req.signedCookies.session_id;

  try {
    if (!validateEmail(user_email)) {
      return res.status(400).send('Invalid user_email');
    }
    if (typeof password !== 'string' || password.trim() === '') {
      return res.status(400).send('Invalid password');
    }


    let connected;
    if (session_id != undefined) {
      // If a session_id cookie is available
      connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1]);

      if (connected[0][0]['Response']) {
        return res.status(400).send('Already have a valid session');
      }
    }

    let response1 = await conn.query(`CALL GetStoredPasswordAndUserId("${user_email}");`);
    response1[1] = createNewObject(response1[1]);
    const user_id = response1[0][0]['UserId'];
    const doesAccountExist = response1[0][0]['Response'];

    if (doesAccountExist === 'Account not existing' ) {
      return res.status(400).send('Invalid credentials');
    }
    else if(doesAccountExist === 'Account exists'){
      const password_is_correct = await checkPasswordArgon2(response1[0][0]['StoredPassword'], password)
      console.log(password_is_correct)
      if(password_is_correct){
        let response2 = await conn.query(`CALL CreateSession(${user_id});`);
        response2[1] = createNewObject(response2[1]);
        const newSessionId = response2[0][0]['SessionId'];

        return res.status(200).cookie('session_id', newSessionId, {
          // secure: true, // -> https or localhost
          httpOnly: true,
          sameSite: 'none', // Should be "strict" in prod
          maxAge: 1 * 60 * 60 * 2 * 1000, // 2 hours
          signed: true,
        }).send('New session. Cookie has been set');
      }
      else{
        res.status(400).send('Invalid credentials')
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});


 
// return res... VS sans return ?


router.delete('/disconnect', async (req, res) => {
  let conn;

  const cookies = req.signedCookies;

  try{
    if(cookies.session_id){
      session_id = cookies.session_id;

        conn = await pool.getConnection();
        let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
        connected[1] = createNewObject(connected[1])

        if(connected[0][0]["Response"]){
          let response = await conn.query(`CALL DeleteSession(${session_id})`);
          response[1] = createNewObject(response[1])

          res.clearCookie("session_id");
          res.status(200).send("disconnected")

        }else{
          res.status(400).send("not connected (session)");
        }

    }
    else{
      res.status(400).send("not connected (cookie)")
    }
  }catch (error) {
    throw error;
  }finally {
    if (conn) conn.release(); // release connection back to pool
  }
});




module.exports = router;