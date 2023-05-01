const express = require('express')
const app = express()

// using pool defined in db.js
const pool = require('./db');


app.get('/', (req, res) => {
  res.send('Hello World!')
})


// temporary endpoint to see the effect of /send_data
app.get('/data', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    //const response = await conn.query("CALL insertData(1.1,3.3,2.2,'2023-04-28 14:30:00',1);");
    const response = await conn.query("SELECT * FROM Monitoring;");
    res.send(response);
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release(); // release connection back to pool
  }
});


app.post('/send_data', async (req, res) => {
  const { send_timestamp, probe_id, data_timestamp, temperature, float_density, refract_density } = req.body;
  let conn;

  try{
    conn = await pool.getConnection();
    // data_timestamp to SQL DATETIME

    //let query = `CALL insertData(${temperature},${float_density},${refract_density},${date},${probe_id});`
    let query = `CALL insertData(${temperature},${float_density},${refract_density},'2023-04-28 14:30:00',${probe_id});`
    const response = await conn.query(query);
    res.send(response)
    res.status(201).json({ message: 'Data successfully saved' });

  }catch(error){
    print(error)
    // error catch
  }
  
});


app.listen(3001, () => {
  console.log('Server started on port 3001')
})