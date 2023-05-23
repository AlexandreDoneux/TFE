const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');


// Endpoint to set the cookie
router.get('/connexion', (req, res) => {
    const userId = 1
    res.cookie('user_id', userId, { maxAge: 3600000 });
    res.send('Cookie has been set');
});


module.exports = router;