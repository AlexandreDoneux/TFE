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



router.post('/archive', async (req, res) => {
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



router.post('/get_archived', async (req, res) => {
  let conn;
  conn = await pool.getConnection();
  const session_id = req.signedCookies.session_id;


  try{
    if(session_id){
      let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1]);
      console.log(connected)

      if(connected[0][0]["Response"]){
        const user_id = connected[0][0]["UserId"];
        console.log(user_id)
        let monitorings = await conn.query(`CALL GetArchivedMonitoringsByUser(${user_id})`);
        console.log(monitorings)
        monitorings[1] = createNewObject(monitorings[1]);

        if(monitorings[0][0]["Response"] === "user does not exist"){
          res.status(400).send("user does not exist");
        }
        else if(monitorings[0][0]["Response"] === "user exists"){
          monitorings_array = monitorings[0][0]["MonitoringIds"].split(",")
          res.status(200).send(monitorings_array)
        }
      
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