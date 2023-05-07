const express = require('express')
const app = express()
const bodyParser = require('body-parser');

// using pool defined in db.js
const pool = require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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


function transformDate(date_to_transform){
  /**
   * Receives a date as a tuple and creates a new date tuple of the first date based on the current date retrieved by the system. The idea is to 
   * reposition the date received inside the system's date "frame".
   */
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Month starts from 0, add 1 to get the correct month number
  const day = currentDate.getDate();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const second = currentDate.getSeconds();
  const currentDateTuple = [year, month, day, hour, minute, second];

  
}




app.get('/', (req, res) => {
  res.send('Hello World!')
})


// temporary endpoint to see the effect of /send_data
app.get('/data', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query("SELECT * FROM Data;");
    res.send(response);
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});


app.get('/current-date', (req, res) => {
  const currentDate = new Date();
  res.send(currentDate);
});


app.post('/send_data', async (req, res) => {
  console.log(req.body)
  const { send_timestamp, probe_id, data_timestamp, temperature, float_density, refract_density } = req.body;
  let conn;

  try{
    conn = await pool.getConnection();
    // data_timestamp to SQL DATETIME
    

    //let query = `CALL insertData(${temperature},${float_density},${refract_density},${date},${probe_id});`
    let query = `CALL insertData(${temperature},${float_density},${refract_density},'2023-04-28 14:30:00',${probe_id}, @_response);`
    let status_response = await conn.query(query);
    const [query_response] = await conn.query('SELECT @_response');

    status_response = createNewObject(status_response)
    
    res.status(201).json({ query_message: query_response["@_response"], query_status: status_response });

  }catch(error){
    console.log(error)
    // error catch
  }
  
});



app.listen(3001, () => {
  console.log('Server started on port 3001')
})