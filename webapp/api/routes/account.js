const express = require("express");
let router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pool = require('../db');


// Endpoint to set the cookie
router.get('/connexion', (req, res) => {
    const userId = 1
    //res.cookie('user_id', userId, { maxAge: 3600000 });
    //res.send('Cookie has been set');

    return res.status(200).cookie("user_id", userId, {
                        
        //secure: true, // -> https
        httpOnly : true,
        sameSite : "none", //Should be "strict" in prod
        maxAge : 1 * 60 * 60 * 2 * 1000, //2 hours
        //signed: true
    }).send("Cookie has been set")
});

router.get('/connexion2', (req, res) => {
    const dummy = 99
    //res.cookie('user_id', userId, { maxAge: 3600000 });
    //res.send('Cookie has been set');

    return res.status(200).cookie("dummy", dummy, {
                        
        //secure: true, // -> https
        httpOnly : true,
        sameSite : "none", //Should be "strict" in prod
        maxAge : 1 * 60 * 60 * 2 * 1000, //2 hours
        signed: true
    }).send("Cookie has been set")
});


router.get('/show_cookie', (req, res) => {
    const cookies = req.headers.cookie; // string contenant tous les cookies séparés par ;
    const signed_cookies = req.signedCookies; // [Object: null prototype] { dummy: '99' }
    //const user_id = cookie.user_id;


    console.log(cookies)
    console.log(signed_cookies)
    //console.log(user_id)
    res.send(`Cookie has `);
    //res.send(`Cookie has user_id : ${user_id}`);
})


module.exports = router;