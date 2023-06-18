const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');





// using pool defined in db.js
const pool = require('./db');

app.use(bodyParser.json());
//app.use(cookieParser());
app.use(cookieParser(secret='MY SECRET')); // définir propre secret -> signature ?

app.use(cors({
  origin: ['http://www.alexandre.doneux.eu:80','http://www.alexandre.doneux.eu', 'https://www.alexandre.doneux.eu:443', 'https://www.alexandre.doneux.eu'],
  credentials : true
}));

/*
app.use((req, res, next) => {
  //res.header('Access-Control-Allow-Origin', '*'); // Replace with your client's domain
  res.header('Access-Control-Allow-Origin', 'http://192.168.0.188:3000, http://192.168.0.138:3000, http://localhost:3000'); // Replace with your client's domain
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
*/


const userRouter = require ("./routes/user");
const dataRouter = require("./routes/data")
const probeRouter = require("./routes/probe")
const monitoringRouter = require("./routes/monitoring")



app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/probe", probeRouter);
app.use("/monitoring", monitoringRouter);



app.listen(3001, () => {
  console.log('Server started on port 3001')
})