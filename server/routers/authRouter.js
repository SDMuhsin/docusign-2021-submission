const express = require('express');
const mongoose = require('mongoose');

// ------- SCHEMA ---------//
const User = require('../schemas/userSchema.js');
// ------- SCHEMA --------//

const router = express.Router();

router.use(function timeLog (req, res, next) {
    console.log('[AUTH ROUTER]');
    console.log('Time: ', Date.now());
    next();
});

router.get('/', (req,res)=>{
    //console.log(req.session);
    if( !!req.session.loggedIn){
        console.log("User is auth'd");
        res.json({status:"ok",authd:true,email:req.session.email})
    }else{
        console.log("user is not auth'd");
        res.json({status:"ok",authd:false,email:""});
    }
})
router.post('/login', async (req,res)=>{
    console.log("\t[LOGIN]")
    console.log("\t\t email", req.body.email ,"Password", req.body.password);
    let data = await User.findOne({'email':req.body.email,'password':req.body.password}).exec();
    console.log(data);
    if( !!data){
        req.session.email = req.body.email;
        req.session.loggedIn = true;
        console.log("Username : ", data.username);
        req.session.username = data.username;
        res.json({status:"ok"});
    }else{
        console.log("\t\t",data);
        res.status(401).send("not ok");
    }
    
    
});

router.get('/logout', (req,res)=>{
    req.session.destroy();
    res.send({status:"ok"});
})

router.post('/signup', async (req,res)=>{
    console.log("\t[SIGNUP]");
    let data = await User.findOne({'email':req.body.email}).exec();
    if(!!data){
        res.status(400).send("not ok");
    }else{
        var user = new User(req.body);
        await user.save();
        res.status(200).end();
    }
});

module.exports = router