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
        const user_id = connected[0][0]["UserId"];
        console.log(user_id)
        let probes = await conn.query(`CALL GetProbesByUser(${user_id})`);
        console.log(probes)
        probes[1] = createNewObject(probes[1]);

        if(probes[0][0]["Response"] === "user does not exist"){
          res.status(400).send("user does not exist");
        }
        else if(probes[0][0]["Response"] === "user exists"){

          /*
          probes_ids_array = probes[0][0]["ProbeIds"].split(",") ///////// change here
          probes_names_array = probes[0][0]["ProbeNames"].split(",") ///////// change here
          probes_active_monitoring_array = probes[0][0]["ActiveMonitoringId"].split(",") ///////// change here

          const probes_array = probes_ids_array.map((value, index) => ({
            probe_id: value,
            probe_name: probes_names_array[index],
            monitoring_id: probes_active_monitoring_array[index],
          }));
          */
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