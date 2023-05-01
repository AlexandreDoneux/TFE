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