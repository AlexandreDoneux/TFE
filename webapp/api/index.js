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


const accountRouter = require ("./routes/account");
const dataRouter = require("./routes/data")



app.use("/account", accountRouter);
app.use("/data", dataRouter);



app.listen(3001, () => {
  console.log('Server started on port 3001')
})