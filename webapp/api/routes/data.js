const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');
const argon2 = require('argon2');

const { createNewObject, transformDate, checkPasswordArgon2, hashPasswordWithArgon2 } = require("../api_functions.js");


router.post('/send_data', async (req, res) => {
  console.log(req.body);
  const { send_timestamp, probe_id, probe_password, ...data } = req.body;
  let conn;
  let responses = [];

  try {
    // Validate request body structure
    if (!Array.isArray(send_timestamp) || send_timestamp.length !== 6) {
      return res.status(400).send('Invalid send_timestamp');
    }
    if (!Number.isInteger(probe_id) || probe_id <= 0) {
      return res.status(400).send('Invalid probe_id');
    }
    if (typeof probe_password !== 'string') {
      return res.status(400).send('Invalid probe_password');
    }
    for (const key in data) {
      const item = data[key];
      if (
        typeof item !== 'object' ||
        typeof item.temperature !== 'number' ||
        typeof item.float_density !== 'number' ||
        typeof item.refract_density !== 'number'
      ) {
        return res.status(400).send('Invalid data');
      }
    }


    conn = await pool.getConnection();

    let query = `CALL RetrieveProbePassword(${probe_id});`;
    let probe_connect = await conn.query(query);

    probe_connect[1] = createNewObject(probe_connect[1]);

    const password_correct = await checkPasswordArgon2(
      probe_connect[0][0]['Response'],
      probe_password
    );

    if (password_correct) {
      for (const [timestamp, item] of Object.entries(data)) {
        const { temperature, float_density, refract_density } = item;

        // temporary to check tcd array working : //////////////////////////////////////////// -> putting null value because sending back array from probe. An error occurs when insertData with array for refract_density
        //const refract_density_null = 0;

        // data_timestamp to SQL DATETIME + transpose to real time "frame"
        const new_data_timestamp = await transformDate(
          send_timestamp,
          timestamp.split(' ')
        );
        const inter_date = new Date(Date.UTC(...new_data_timestamp)).toISOString();
        const date = inter_date.replace('T', ' ').replace('Z', ''); // "2023-06-07T16:19:38.000Z" -> T and Z must go away

        let query = `CALL insertData(${temperature},${float_density},${refract_density},"${date}",${probe_id});`;
        let response = await conn.query(query);

        response[1] = createNewObject(response[1]);
        response[0] = response[0][0];

        responses.push(response);
      }

      res.send(responses);
    } else {
      res.send('Wrong password');
    }
  } catch (error) {
    console.log(error);
    // error catch
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});



router.post('/send_calibration_data', async (req, res) => {
  console.log(req.body);
  const {probe_id, probe_password, pitch, tcd_values } = req.body;
  let conn;
  let responses = [];

  try {
    if (!Number.isInteger(probe_id) || probe_id <= 0) {
      return res.status(400).send('Invalid probe_id');
    }
    if (typeof probe_password !== 'string') {
      return res.status(400).send('Invalid probe_password');
    }
    

    conn = await pool.getConnection();

    let query = `CALL RetrieveProbePassword(${probe_id});`;
    let probe_connect = await conn.query(query);

    probe_connect[1] = createNewObject(probe_connect[1]);

    const password_correct = await checkPasswordArgon2(
      probe_connect[0][0]['Response'],
      probe_password 
    );

    if (password_correct) {
      console.log(pitch)
      console.log(tcd_values)

      res.send(responses);
    } else {
      res.send('Wrong password');
    }
  } catch (error) {
    console.log(error);
    // error catch
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});


router.post('/send_tcd_data', async (req, res) => {
  console.log("hey")
  console.log(req.body);
  console.log("ho")
  const {probe_id, probe_password, pitch } = req.body;
  const tcd_values = pitch;
  let conn;
  let responses = [];

  try {
    if (!Number.isInteger(probe_id) || probe_id <= 0) {
      return res.status(400).send('Invalid probe_id');
    }
    if (typeof probe_password !== 'string') {
      return res.status(400).send('Invalid probe_password');
    }
    

    conn = await pool.getConnection();

    let query = `CALL RetrieveProbePassword(${probe_id});`;
    let probe_connect = await conn.query(query);

    probe_connect[1] = createNewObject(probe_connect[1]);

    const password_correct = await checkPasswordArgon2(
      probe_connect[0][0]['Response'],
      probe_password
    );

    if (password_correct) {
      console.log(tcd_values)
      //console.log(tcd1304_array)

      res.send(responses);
    } else {
      res.send('Wrong password');
    }
  } catch (error) {
    console.log(error);
    // error catch
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});

  
  


router.post('/get_monitoring', async (req, res) => {
  let conn;
  
  const session_id = req.signedCookies.session_id;
  const { monitor_id } = req.body;

  try{
    if(session_id){
      conn = await pool.getConnection();
      let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
      connected[1] = createNewObject(connected[1])

      if(connected[0][0]["Response"]){
        let response = await conn.query(`CALL SelectData(${monitor_id});`);
  
        response[1] = createNewObject(response[1])
        //console.log(response)
        /* // handle later
        if(response[0][0]["Response"] === "No monitoring found for the specified MonitorId"){
          res.status(400).send(response)
        }
        */
        res.status(200).send(response);
      
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