const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');

const { createNewObject, transformDate, validateEmail  } = require("../api_functions.js");





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
  let conn;
  conn = await pool.getConnection();
  const { user_email, password } = req.body;
  let session_id = req.signedCookies.session_id;

  try {
    if (session_id != undefined) {
      // If a session_id cookie is available
      let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1]);

      if (connected[0][0]['Response']) {
        res.send('Already have a valid session');
      } else {
        // If session not valid (not in DB)
        if (!validateEmail(user_email)) {
          return res.status(400).send('Invalid user_email');
        }
        if (typeof password !== 'string' || password.trim() === '') {
          return res.status(400).send('Invalid password');
        }

        let response1 = await conn.query(`CALL CheckUserPasswordMatch("${user_email}", "${password}");`);
        response1[1] = createNewObject(response1[1]);
        const user_id = response1[0][0]['UserId'];

        if(response1[0][0]['Response'] === "Password does not match"){
          return res.status(400).send('Invalid password');
        }
        if(response1[0][0]['Response'] === "Account not existing"){
          return res.status(400).send('Invalid user_email');
        }

        console.log(user_id)
        console.log(response1)

        let response2 = await conn.query(`CALL CreateSession(${user_id});`);
        response2[1] = createNewObject(response2[1]);
        let session_id = response2[0][0]['SessionId'];

        return res.status(200).cookie('session_id', session_id, {
          //secure: true, // -> https or localhost
          httpOnly: true,
          sameSite: 'none', // Should be "strict" in prod
          maxAge: 1 * 60 * 60 * 2 * 1000, // 2 hours
          signed: true,
        }).send('New session. Cookie has been set');
      }
    } else {
      // No cookie available
      if (!validateEmail(user_email)) {
        return res.status(400).send('Invalid user_email');
      }
      if (typeof password !== 'string' || password.trim() === '') {
        return res.status(400).send('Invalid password');
      }

      let response1 = await conn.query(`CALL CheckUserPasswordMatch("${user_email}", "${password}");`);
      response1[1] = createNewObject(response1[1]);
      const user_id = response1[0][0]['UserId'];

      if(response1[0][0]['Response'] === "Password does not match"){
        return res.status(400).send('Invalid password');
      }
      if(response1[0][0]['Response'] === "Account not existing"){
        return res.status(400).send('Invalid user_email');
      }

      console.log(user_id)
      console.log(response1)

      let response2 = await conn.query(`CALL CreateSession(${user_id});`);
      response2[1] = createNewObject(response2[1]);
      let session_id = response2[0][0]['SessionId'];

      return res.status(200).cookie('session_id', session_id, {
        //secure: true, // -> https or localhost
        httpOnly: true,
        sameSite: 'none', // Should be "strict" in prod
        maxAge: 1 * 60 * 60 * 2 * 1000, // 2 hours
        signed: true,
      }).send('New session. Cookie has been set');
    }
  } catch (error) {
    throw error;
    //res.send("error") //send error and not throw error -> later
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});


 



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
          res.send("disconnected")

        }else{
          res.send("not connected (session)");
        }

    }
    else{
      res.send("not connected (cookie)")
    }
  }catch (error) {
    throw error;
  }finally {
    if (conn) conn.release(); // release connection back to pool
  }
});




router.get('/dummy_cookie', (req, res) => {
    const dummy = 99

    return res.status(200).cookie("dummy", dummy, {
                        
        //secure: true, // -> https
        httpOnly : true,
        sameSite : "none", //Should be "strict" in prod
        maxAge : 1 * 60 * 60 * 2 * 1000, //2 hours
        signed: true
    }).send("Cookie has been set")
});


router.get('/show_cookie', (req, res) => {
    const cookies = req.headers.cookie; // string contenant tous les cookies séparés par ;
    const cookies2 = req.cookies.session_id // pour aller chercher un cookie spécifique   ATTENTION : undefined si il est signé
    const signed_cookies = req.signedCookies; // [Object: null prototype] { dummy: '99' }


    console.log(req.signedCookies.session_id)
    console.log(cookies)
    console.log(cookies2)
    console.log(signed_cookies) // -> cookies signés permets de vérifier que le cookie n'a pas été modifié. Si il a été modifié la valeur sera false (.signedCookie)
    res.send(`Cookie has `);
    //res.send(`Cookie has user_id : ${user_id}`);
})


module.exports = router;