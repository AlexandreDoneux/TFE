const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');

const { createNewObject, transformDate  } = require("../api_functions.js");
  
  
// temporary endpoint to see the effect of /send_data
router.get('/', async (req, res) => {
    let conn;
    const cookies = req.cookies;

    if(cookies.session_id){
        session_id = cookies.session_id;

        try {
            conn = await pool.getConnection();
            let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
            connected[1] = createNewObject(connected[1])
  
            if(connected[0][0]["Result"]){
              let response = await conn.query("SELECT * FROM Session;");
              res.send(response);
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
  
  
router.post('/send_data', async (req, res) => {
    console.log(req.body)
    const { send_timestamp, probe_id, data_timestamp, temperature, float_density, refract_density } = req.body;
    let conn;
  
    try{
      conn = await pool.getConnection();
  
      // data_timestamp to SQL DATETIME + transpose to real time "frame"
      const new_data_timestamp = await transformDate(data_timestamp, send_timestamp)
      const inter_date = new Date(Date.UTC(...new_data_timestamp)).toISOString();
      const date = inter_date.replace("T", " ").replace("Z", "");  // "2023-06-07T16:19:38.000Z" -> T and Z must go away
  
      let query = `CALL insertData(${temperature},${float_density},${refract_density},"${date}",${probe_id});`
      let response = await conn.query(query);
  
      response[1] = createNewObject(response[1])
      response[0] = response[0][0]
  
      //console.log(status_response)
      res.send(response)
  
    }catch(error){
      console.log(error)
      // error catch
    }finally {
      if (conn) conn.release(); // release connection back to pool
    }
    
});
  
  
router.post('/monitoring_data', async (req, res) => {
    console.log(req.body) 
  
    const { monitor_id } = req.body;
    console.log("hey")
    console.log(monitor_id)
    let conn;
    try {
      conn = await pool.getConnection();
      let response = await conn.query(`CALL SelectData(${monitor_id});`);
  
      response[1] = createNewObject(response[1])
      
      console.log(response)
      res.send(response);
    } catch (error) {
      throw error;
      //res.send("error") //send error and not throw error -> later
    } finally {
      if (conn) conn.release(); // release connection back to pool
    }
});

module.exports = router;