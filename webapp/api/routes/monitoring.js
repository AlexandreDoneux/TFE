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
  const { monitor_name, probe_id } = req.body;


  try{
    if(session_id){
      let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1])

      if(connected[0][0]["Response"]){
        const user_id = connected[0][0]["UserId"];
        let response = await conn.query(`CALL CreateMonitoring("${monitor_name}", ${probe_id}, ${user_id})`);
        console.log(response)
        response[1] = createNewObject(response[1]);

        
        if(response[0][0]["Response"] === "Probe does not belong to the user"){
          //monitorings_array = monitorings[0][0]["MonitoringIds"].split(",")
          res.status(400).send("Probe does not belong to the user");
        }
        else if(response[0][0]["Response"] === "Monitoring already exists for the probe"){
          res.status(400).send("Monitoring already exists for the probe");
        }
        else if(response[0][0]["Response"] === "Monitoring created successfully"){
          const monitoringId = response[0][0]["MonitoringId"];
          const message = "Monitoring created successfully";
          res.status(200).json({ message, monitoringId });
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



router.post('/archive', async (req, res) => {
  let conn;
  conn = await pool.getConnection();
  const session_id = req.signedCookies.session_id;
  const {monitor_id} = req.body;


  try{
    if(session_id){
      let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1])

      if(connected[0][0]["Response"]){
        const user_id = connected[0][0]["UserId"];
        let response = await conn.query(`CALL ArchiveMonitoring(${user_id}, ${monitor_id})`);
        console.log(response)
        response[1] = createNewObject(response[1]);

        
        if(response[0][0]["Response"] === "monitoring has been archived"){
          //monitorings_array = monitorings[0][0]["MonitoringIds"].split(",")
          res.status(200).send("monitoring archived");
        }
        else if(response[0][0]["Response"] === "monitoring is already archived"){
          res.status(400).send("monitoring is already archived");
        }
        else if(response[0][0]["Response"] === "monitoring does not exist or is not related to the user"){
          res.status(400).send("monitoring does not exist or is not related to the user");
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



router.post('/get_archived', async (req, res) => {
  let conn;
  conn = await pool.getConnection();
  const session_id = req.signedCookies.session_id;

  console.log(session_id)
  console.log(req.signedCookies)


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
          console.log(monitorings[0][0])
          if(monitorings[0][0]=== null){
            res.status(200).json({"response":"no archived monitorings"});
          }
          else{
            monitorings_array = monitorings[0][0]["MonitoringIds"].split(",")
            /*
            res.status(200).json({"response":"ok",
                                  "monitoring_array" : monitoring_array});
            */
            res.status(200).send(monitorings_array)
          }
          
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



router.post('/get_data', async (req, res) => {
  let conn;
  conn = await pool.getConnection();
  const session_id = req.signedCookies.session_id;
  const { monitor_id } = req.body;

  try{
    if(session_id){
      let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1]);
      console.log(connected)

      if(connected[0][0]["Response"]){
        // CODE HERE

        let monitoring_data = await conn.query(`CALL GetMonitoringData(${monitor_id})`);
        console.log(monitoring_data)
        monitoring_data[1] = createNewObject(monitoring_data[1]);

        if(monitoring_data[0][0]["Response"] === "monitoring does not exist"){
          res.status(400).send("monitoring does not exist");
        }
        else if(monitoring_data[0][0]["Response"] === "monitoring exists"){
          
          monitoring_data_object = {
            "monitor_id" : monitor_id,
            "name" : monitoring_data[0][0]["monitoringName"],
            "start_date" : monitoring_data[0][0]["monitoringStartDate"],
            "end_date" : monitoring_data[0][0]["monitoringEndDate"]
          }
          res.status(200).send(monitoring_data_object)
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