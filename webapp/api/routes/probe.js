const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');

const { createNewObject, transformDate  } = require("../api_functions.js");


router.post('/add', async (req, res) => {
  let conn;
  conn = await pool.getConnection();
  const session_id = req.signedCookies.session_id;


  try{
    if(session_id){
      let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1])

      if(connected[0][0]["Response"]){
        // ENDPOINT CODE HERE
      
      }
      else{
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


//
router.post('/get_all', async (req, res) => {
  let conn;
  conn = await pool.getConnection();
  const session_id = req.signedCookies.session_id;


  try{
    if(session_id){
      let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1])

      if(connected[0][0]["Response"]){
        // ENDPOINT CODE HERE
      
      }
      else{
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



module.exports = router;