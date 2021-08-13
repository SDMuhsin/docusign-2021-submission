const express = require('express');
const mongoose = require('mongoose');
const docusign = require('docusign-esign');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { isBoolean } = require('util');
const Document = require( '../schemas/documentSchema.js');
const Checkpoint = require('../schemas/checkpointSchema.js');



// ------- SCHEMA --------//



router.get('/:by', async(req,res)=>{
    console.log("[GET DOCUMENT]");
    console.log("  Get by ", req.params.by);

    if(req.params.by == "signer_email"){
        console.log("  Finding by signer email ", req.session.email);
        let r = await Document.find({docSigners:{$elemMatch: {signerEmail: req.session.email} } } );
        console.log("  Response : ", r);
        res.json(r);
    }else if(req.params.by == "admin_email"){
        console.log("  Finding by admin email ", req.session.email);
        let r = await Document.find({adminEmail:req.session.email } );
        console.log("  Response : ", r);
        res.json(r);
    }else if(req.params.by == "all"){

    }else{
        res.status(404).json({status:"not ok",msg:"invalid by param"});
        
    }
})
router.post('/create', async(req,res)=>{
    console.log("[DOCUMENT][CREATE]");
    console.log("  Checking if authd")
    if(!!req.session.email){
        console.log("   -Authd")
        let b = req.body;
        b.adminEmail = req.session.email;
        b.adminName = req.session.username;

        // Find email name from email
        
        b.status = "UNDER REVIEW";
        b.history = [];
        b.currentHistoryIndex = 0;
        
        console.log("  Signers");
        for(let i = 0; i < b.docSigners.length; i++){
            console.log("   ", b.docSigners[i]);
        }
        let doc = Document(b);
        console.log("  saving..");
        let r = await doc.save();
        console.log("  ", r);
        res.json(r);
    }
    else{console.log("   -NOT authd");res.status(401).json({status:"not ok",msg:"not authd"})}
});

router.get('/signer/edit_access/request/:doc_id', async (req,res) =>{
    // Check if auth'd
    console.log("[SIGNER REQUESTS EDIT ACCESS]");
    if(!!req.session.email){
        console.log("  signer : ", req.session.email);
        const filter = {_id:req.params.doc_id};
        console.log("  Finding document")
        let rs = await Document.find(filter)
        .exec()
        .then( async (rs) => {
            console.log( "    Found, is of type ", typeof(rs));

            if(typeof(rs) == typeof(" ")){
                rs = JSON.parse(rs);
            }
            
            if(!!rs){
                console.log("    Found document : ", rs);
                rs = rs[0];
                console.log(rs.docSigners);
                console.log(rs["docSigners"]);
                console.log("  Finding signer details");
                flag = 0;
                let upd;
                for(let i = 0; i < rs["docSigners"].length; i++){
                    if(rs["docSigners"][i].signerEmail == req.session.email){
                        flag = 1;
                        console.log("    Found signer, updating requestingAccess field");
                        rs["docSigners"][i]["requestingAccess"] = true;
                        
                    }
                }
                if(flag){
                    upd = rs["docSigners"];
                    let rs2 = await Document.findOneAndUpdate(filter, {docSigners:upd},{new:false})
                    .exec()
                    .then( rs2 => {
                        if(!!rs2){
                            res.json(rs2);
                        }
                        else{
                            res.status(500).json({msg:"Couldn't update?"})
                        }
                    });

                }
                else{
                    console.log("    Couldn't find signer");
                    res.status(500).json({status:"not ok",msg:"couldn't find signer"});
                }
            }
            else{
                console.log("    Couldnt find document...",res);
                res.status(500).json({status:"not ok",msg:"could not find document"});
            }
        });
        
        
    }
    else{
        console.log("  signer not logged in");
        res.status(401).json({status:"not ok",msg:"Not authd"})
    }

});

router.get('/admin/change_signer_access/:to_access/:to_email/:doc_id', (req,res) =>{
    console.log("[CHANGE SIGNER ACCESS]");
    // Check if authd
    if(!!req.session.email){
        // Get the document in question
        console.log("C1");
        Document.find({_id:req.params.doc_id,adminEmail:req.session.email}, (err,docs)=>{
            if(err){res.status(500).json(err)}
            else{
                if(!!docs && docs.length != 0){
                    // Find The signer in question
                    flag = 0;
                    for(let i = 0; i < docs[0].docSigners.length; i++){
                        if(docs[0].docSigners[i].signerEmail == req.params.to_email){
                            docs[0].docSigners[i].signerEditAccess = req.params.to_access == 'YES' ? true : false;
                            docs[0].docSigners[i].requestingAccess = req.params.to_access == 'YES' ? false : docs[0].docSigners[i].requestingAccess;
                            flag = 1;
                            break
                        }
                    }
                    if(!flag){
                        res.status(500).json({msg:"signer not found by email "+req.params.to_email});
                    }
                    else{
                        
                        Document.updateOne({_id:req.params.doc_id,adminEmail:req.session.email},{docSigners: docs[0].docSigners},(err2,docs2)=>{
                            if(err2){res.status(500).json(err2)}
                            else{
                                res.status(200).json(docs2)
                            }
                        });
                    }

                }else{
                    res.status(500).json({msg:"doc not found (with this admin email)"})
                }
            }
        });
        
        

    }else{
        res.status(401).json({msg:"not authd"});
    }
})

router.post('/comment/create/:doc_id', async (req,res)=>{
    console.log("[CREATE COMMENT]");
    /*
    Expected body : 
        title
        type
        description
        [SET] created : {by: SET, on : SET}
        [SET] status {}
        [SET] thread
    */

    if(!!req.session.email){
        let comment = req.body;
        comment.created = {
            by : req.session.username,
            on : new Date()
        };
        comment.thread = [];
        comment.status = {status:"RAISED",last_updated_by:req.session.username};
        comment._id = new mongoose.Types.ObjectId();
        comment.history = [{status:"RAISED",updated_by:req.session.username,on:new Date()}];
        console.log("ID", comment._id,typeof(comment_id));
        console.log("  Updating document");
        try{
            await Document.updateOne({_id:req.params.doc_id},{$push:{comments:comment}});
            res.status(200).json({})
        }
        catch(e){
            res.status(500).json({msg:"could not update",err:e})
        }
    }
    else{
        res.status(401).json({msg:"not authd"});
    }
});

router.put('/comment/update/thread/add_message/:comment_id', async (req,res) =>{
    /*
        msg
        [SET] created : {by,on}
    */
    console.log("[ADD THREAD MESSAGE");
    if(!!req.session.email){
        const msg = {msg:req.body.msg,created:{by:req.session.username,on:new Date()}};
        try{
            let ans = await Document.updateOne( {comments:{$elemMatch:{_id:mongoose.Types.ObjectId(req.params.comment_id)}}}, {$push:{'comments.$.thread':msg}});
            console.log(ans)
            res.status(200).json({})
        }
        catch(e){
            res.status(500).json({msg:"could not update",err:e})
        }
    }
    else{
        res.status(401).json({msg:"not authd"});
    }    
});

router.put('/comment/update/comment_status/:doc_id/:comment_id/:to', async (req,res) =>{
    console.log("[UPDATE COMMENT STATUS]");
    console.log("\t Update " + req.params.doc_id + "  " + req.params.comment_id);
    console.log("\t to " + req.params.to);
    if(!!req.session.email){       
        try{
            try{
            await Document.updateOne(
                {
                    _id:req.params.doc_id,
                    comments:{$elemMatch:{_id:mongoose.Types.ObjectId(req.params.comment_id)}}
                },
                {
                    $push:{
                        'comments.$.history':{
                            status:req.params.to,updated_by:req.session.username,on:new Date()
                        }
                    }
                }
            );
            }
            catch(e){
                res.status(500).json(e);
            }
            Document.updateOne(
                    {
                    _id:req.params.doc_id,
                    comments:{$elemMatch:{_id:mongoose.Types.ObjectId(req.params.comment_id)}}
                },
                {
                    $set:{'comments.$.status': {
                        status:req.params.to,last_updated_by:req.session.username
                    }
                }
                }
             ).then(ans =>{
                 console.log(ans);
             });
            
            res.status(200).json({})
        }
        catch(e){
            res.status(500).json({msg:"could not update",err:e})
        }
    }
    else{
        res.status(401).json({msg:"not authd"});
    }    
});

router.get('/signer/approval_status/:doc_id/:to', async(req,res) =>{
    if(!!req.session.email){
        let ans = await Document.updateOne(
            {
                _id:req.params.doc_id,
                docSigners:{
                    $elemMatch:{
                        signerEmail : req.session.email
                    }
                }
            },
            {
                'docSigners.$.signerApprovalStatus' : req.params.to
            }
        )
        .catch(e =>{
            console.log(e);
            res.status(500).json(e);
        });

        res.status(200).json(ans);
    }
    else{
        res.status(401).json({msg:"not authd"});
    }
});
/* ============================================================
  Function: Download Image
============================================================ */

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
);

router.post('/checkpoint/:doc_id', async (req,res)=>{
    /*
        img_url : 
    */
    let example_image_1 = await download_image(req.body.img_url, 'map.png');
    const img_b64 = fs.readFileSync('./map.png', 'base64');

    try{

        const checkpoint = new Checkpoint({img_b64:img_b64});

        let ans1 = await checkpoint.save()
        //console.log(ans1)
        const record = {
            checkpoint_id : ans1._id,
            created : {
                by:req.session.username,
                on:new Date()
            }
        };
        let ans = await Document.updateOne({_id:req.params.doc_id},{$push:{history:record }});
        //console.log(img_b64);*/
        //console.log(ans);
        res.status(200).json({payload:ans})
    }
    catch(e){
        res.status(500).json({err:e});
    }

});

router.get('/checkpoint/:checkpoint_id', async (req,res) => {
    if(!!req.session.email){
        try{
            let ans = await Checkpoint.findOne({_id:req.params.checkpoint_id});
            res.json(ans);
        }
        catch(e){
            res.status(500).json({msg:"failed to retrieve",err:e})
        }
    }else{
        res.status(401).json({})
    }
});


module.exports = router