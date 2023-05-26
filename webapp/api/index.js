const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');


// using pool defined in db.js
const pool = require('./db');

app.use(bodyParser.json());
//app.use(cookieParser());
app.use(cookieParser('MY SECRET')); // définir propre secret -> signature ?

app.use(cors({
  origin: '*'
}));


const accountRouter = require ("./routes/user");
const dataRouter = require("./routes/data")
const probeRouter = require("./routes/probe")
const monitoringRouter = require("./routes/monitoring")



app.use("/user", accountRouter);
app.use("/data", dataRouter);
app.use("/probe", probeRouter);
app.use("/monitoring", monitoringRouter);



app.listen(3001, () => {
  console.log('Server started on port 3001')
})