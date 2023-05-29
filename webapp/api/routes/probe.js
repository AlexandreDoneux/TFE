const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');

const { createNewObject, transformDate  } = require("../api_functions.js");



router.post('/add', async (req, res) => {
    let conn;
  
    const cookies = req.signedCookies;
  
  
    if(cookies.session_id){
        session_id = cookies.session_id;
  
        try {
            conn = await pool.getConnection();
            let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
            connected[1] = createNewObject(connected[1])
  
            if(connected[0][0]["Response"]){
              // ACTIONS OF THE ENDPOINT HERE
  
            }else{
              res.send("not connected (session)");
            }
            
          } catch (error) {
            throw error;
          } finally {
            if (conn) conn.release(); // release connection back to pool
          }
  
    }else{
        res.send("not connected (cookie)")
    }
});



router.post('/get_all', async (req, res) => {
  // send back the probes id of a user and their active monitoring
    let conn;
  
    const cookies = req.signedCookies;
  
  
    if(cookies.session_id){
        session_id = cookies.session_id;
  
        try {
            conn = await pool.getConnection();
            let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
            connected[1] = createNewObject(connected[1])
  
            if(connected[0][0]["Response"]){
              // ACTIONS OF THE ENDPOINT HERE
  
            }else{
              res.send("not connected (session)");
            }
            
          } catch (error) {
            throw error;
          } finally {
            if (conn) conn.release(); // release connection back to pool
          }
  
    }else{
        res.send("not connected (cookie)")
    }
});



module.exports = router;