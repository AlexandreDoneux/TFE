const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');
const argon2 = require('argon2');

const { createNewObject, transformDate, checkPasswordArgon2, hashPasswordWithArgon2 } = require("../api_functions.js");
  
  
// temporary endpoint to see the effect of /send_data
router.get('/', async (req, res) => {
    let conn;
    const cookies = req.signedCookies;

    if(cookies.session_id){
        session_id = cookies.session_id;

        try {
            conn = await pool.getConnection();
            let connected = await conn.query(`CALL CheckSessionExists(${session_id})`);
            connected[1] = createNewObject(connected[1])
  
            if(connected[0][0]["Response"]){
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
  console.log(req.body);
  const { send_timestamp, probe_id, probe_password, ...data } = req.body;
  let conn;
  let responses = [];

  hashed_password = await hashPasswordWithArgon2("mdptoto");
  console.log(hashed_password);
  hashed_password2 = await argon2.hash('mdptoto')
  console.log(hashed_password2);

  is_equal2 = await argon2.verify(hashed_password, "mdptoto")
  console.log(is_equal2)
  
  is_equal = await checkPasswordArgon2(hashed_password, "mdptoto");
  console.log(is_equal);

  try {
    conn = await pool.getConnection();

    let query = `CALL CheckProbePassword(${probe_id}, "${probe_password}");`;
    let probe_connect = await conn.query(query);
    console.log(probe_connect)

    probe_connect[1] = createNewObject(probe_connect[1]);
    //probe_connect[0] = probe_connect[0][0]

    if(probe_connect[0][0]["Response"] === "correct"){
      for (const [timestamp, item] of Object.entries(data)) {
        const { temperature, float_density, refract_density } = item;
  
        // data_timestamp to SQL DATETIME + transpose to real time "frame"
        const new_data_timestamp = await transformDate(send_timestamp, timestamp.split(" "));
        const inter_date = new Date(Date.UTC(...new_data_timestamp)).toISOString();
        const date = inter_date.replace("T", " ").replace("Z", ""); // "2023-06-07T16:19:38.000Z" -> T and Z must go away
  
        let query = `CALL insertData(${temperature},${float_density},${refract_density},"${date}",${probe_id});`;
        let response = await conn.query(query);
  
        response[1] = createNewObject(response[1]);
        response[0] = response[0][0];
  
        responses.push(response);
      }
  
      res.send(responses);
    }
    else{
      res.send("wrong password");
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
        res.send(response);
      
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


/*
router.post('/monitoring_data', async (req, res) => {
  console.log(req.body) 

  const { monitor_id } = req.body;

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
*/




module.exports = router;