const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');


// using pool defined in db.js
const pool = require('./db');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: '*'
}));



function createNewObject(okPacket) {
  const newObj = {};
  for (let [key, value] of Object.entries(okPacket)) {
    // If the value is a BigInt, transform to string
    // Trnasform also integers and floats ?
    if(typeof value === 'bigint'){
      value=value.toString()
    }
    newObj[key] = value;
  }
  return newObj;
}


function transformDate(date_to_transform, compare_date){
  /**
   * Receives a date as a tuple and creates a new date tuple of the first date based on the current date retrieved by the system. The idea is to 
   * reposition the date received inside the system's date "frame". Figuring the time translation between compare_date and the current time to apply 
   * its translation to dtae_to_transform.
   */
  const current_date = new Date().toLocaleString('en-US', { timeZone: 'Europe/Brussels', hour12: false });
  const date_components = current_date.split(/[\/,: ]+/).map(component => parseInt(component));
  const [month, day, year, hour, minute, second] = date_components;
  const current_date_tuple = [year, month, day, hour, minute, second];

  // calculate difference in time between the send date and real date
  const time_translation = current_date_tuple.map((elem, index) => elem - compare_date[index]);

  // adding the time translation (between send date and real date) to the date to be transformed
  const transformed_date = date_to_transform.map((elem, index) => elem + time_translation[index]);

  return transformed_date
}




app.get('/', (req, res) => {
  res.send('Hello World!')
})


// temporary endpoint to see the effect of /send_data
app.get('/data', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query("SELECT * FROM User;");
    res.send(response);
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});


app.post('/send_data', async (req, res) => {
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


app.post('/monitoring_data', async (req, res) => {
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


// Endpoint to set the cookie
app.get('/connexion', (req, res) => {
  const userId = 1
  res.cookie('user_id', userId, { maxAge: 3600000 });
  res.send('Cookie has been set');
});



app.listen(3001, () => {
  console.log('Server started on port 3001')
})