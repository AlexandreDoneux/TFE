const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');

const { createNewObject, transformDate, hashPasswordWithArgon2  } = require("../api_functions.js");


router.post('/add', async (req, res) => {
  let conn;
  conn = await pool.getConnection();
  const session_id = req.signedCookies.session_id;
  const { probe_frontend_hashed, probe_name } = req.body;

  // hash with argon2
  console.log(typeof(probe_frontend_hashed))
  const probe_password = await hashPasswordWithArgon2(probe_frontend_hashed) //problem here ????
  //const probe_password = probe_frontend_hashed;


  try{
    if(session_id){
      let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1])

      if(connected[0][0]["Response"]){
        /////////////////////////////////////////
        const user_id = connected[0][0]["UserId"];
        let response = await conn.query(`CALL CreateProbe(${user_id},"${probe_name}", "${probe_password}")`);
        console.log(response)
        response[1] = createNewObject(response[1]);
        
        if(response[0][0]["Response"] === "User does not exist"){
          res.status(400).send("User does not exist");
        }
        else if(response[0][0]["Response"] === "Probe name already exists for the user"){
          res.status(400).send("Probe name already exists for the user");
        }
        else if(response[0][0]["Response"] === "Probe created successfully"){
          const probeId = response[0][0]["ProbeId"]; // not necessary
          const message = "Probe created successfully";
          res.status(200).json({ message, probeId });
        }
      
      }
      else{
        res.status(400).send("not connected (session)");
      }
    }
    else{
      res.status(400).send("not connected (cookie)");
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
        const user_id = connected[0][0]["UserId"];
        console.log(user_id)
        let probes = await conn.query(`CALL GetProbesByUser(${user_id})`);
        console.log(probes)
        probes[1] = createNewObject(probes[1]);

        if(probes[0][0]["Response"] === "user does not exist"){
          res.status(400).send("user does not exist");
        }
        else if(probes[0][0]["Response"] === "user exists"){
          const probes_array = probes[0];

          res.status(200).send(probes_array )
        }
      
      }
      else{
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