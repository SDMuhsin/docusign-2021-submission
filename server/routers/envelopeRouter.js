const express = require('express');
const mongoose = require('mongoose');
const docusign = require('docusign-esign');
const router = express.Router();
const path = require('path');
const fs = require('fs');


const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjY4MTg1ZmYxLTRlNTEtNGNlOS1hZjFjLTY4OTgxMjIwMzMxNyJ9.eyJUb2tlblR5cGUiOjUsIklzc3VlSW5zdGFudCI6MTYyODg1MjE5NSwiZXhwIjoxNjI4ODgwOTk1LCJVc2VySWQiOiIxNWQ3NTViNC1lNWIyLTQwYzktOTM3ZS01ZTU1ZjFkMTI2NDIiLCJzaXRlaWQiOjEsInNjcCI6WyJpbXBlcnNvbmF0aW9uIiwiZXh0ZW5kZWQiLCJzaWduYXR1cmUiLCJjbGljay5tYW5hZ2UiLCJjbGljay5zZW5kIiwib3JnYW5pemF0aW9uX3JlYWQiLCJncm91cF9yZWFkIiwicGVybWlzc2lvbl9yZWFkIiwidXNlcl9yZWFkIiwidXNlcl93cml0ZSIsImFjY291bnRfcmVhZCIsImRvbWFpbl9yZWFkIiwiaWRlbnRpdHlfcHJvdmlkZXJfcmVhZCIsImR0ci5yb29tcy5yZWFkIiwiZHRyLnJvb21zLndyaXRlIiwiZHRyLmRvY3VtZW50cy5yZWFkIiwiZHRyLmRvY3VtZW50cy53cml0ZSIsImR0ci5wcm9maWxlLnJlYWQiLCJkdHIucHJvZmlsZS53cml0ZSIsImR0ci5jb21wYW55LnJlYWQiLCJkdHIuY29tcGFueS53cml0ZSIsInJvb21fZm9ybXMiLCJub3Rhcnlfd3JpdGUiLCJub3RhcnlfcmVhZCIsInNwcmluZ19yZWFkIiwic3ByaW5nX3dyaXRlIl0sImF1ZCI6IjNhMmUxYzliLTZmNGMtNDBmZS1hNTAxLTg5OGEyMGQyYmRjNiIsImF6cCI6IjNhMmUxYzliLTZmNGMtNDBmZS1hNTAxLTg5OGEyMGQyYmRjNiIsImlzcyI6Imh0dHBzOi8vYWNjb3VudC1kLmRvY3VzaWduLmNvbS8iLCJzdWIiOiIxNWQ3NTViNC1lNWIyLTQwYzktOTM3ZS01ZTU1ZjFkMTI2NDIiLCJhdXRoX3RpbWUiOjE2Mjg4NTIxODMsInB3aWQiOiIxNGNkNTUyNy1jOGI2LTRlMTYtYmQwYS03NzAyZGI3MzAzNmYifQ.hAAoNF13QNm2FTvkmR0B7vzllM5CmHi7_8YX1vu37AUE2jfPDuqpYk7U1z5buq_Ff-97ehRyWfcTJ4t_Gh3QslMwQV-yMVYg9yhvF9-S1YWk0ufJ-QTmz6z0yYGWZWZ3f_N-SLvGKhVpljQQ5EwwqeLqIllW1zW-TJ0PFa8NjwLlDagWxbdtZCKJ56womJdNiJ81lrZgneljOs3qcUc1r_W4tj3_P5BViBuVjdu6fQXDIhto11WGatDSvlTiJKEtXRBYkVAGAxKR_hjnD5v-56tZpNch2amhpfEb3oulCQdq_SU-CkKWfhhSk65egob_fan4cSMMUUCtUw3d8TOD2g';
const apiAccountId = 'b3615a21-2860-4e05-8e43-139f8c5eaa03';
const basePath = 'https://demo.docusign.net/restapi';

const Document = require( '../schemas/documentSchema.js');
const Checkpoint = require('../schemas/checkpointSchema.js');
// ------------- UTILITY -------------------
const demoDocsPath = './';
const pdf1File = 'document.pdf';
function makeEnvelope(args, p1Data){
    //args.signerEmail
    //args.signerName
    //args.signerClientId
    
    /*-----------
        signers
            signerEmail
            signerName
            signerClientId = signerEmail
        img_b64

            TO DO : 
                Make envelope
                add PNG to envelope
                add an HTML Document 
                    put signer field in the html document
                return 
    -------------*/

  

  
    // create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = 'Please sign this document';
  
    // add the documents

  
    /* 
        PNG DOCUMENT
    */
   let doc2 = new docusign.Document();

    doc2.documentBase64 = args.img_b64;
    doc2.name = 'Map';
    doc2.fileExtension = 'png'; // pdf?
    doc2.documentId = '4';

    /*
        SIGN DOCUMENT : HTML
    */
    let doc3 = new docusign.Document();
    doc3.documentBase64 = Buffer.from( makeHTMLSignPage(args.signers) ).toString('base64');
    doc3.name = "Sign";
    doc3.fileExtension = "html";
    doc3.documentId = "5";

    /*
        TABLE DOCUMENT :HTML
    */

    let doc1 = new docusign.Document();
    doc1.documentBase64 = Buffer.from( makeCommentsPage(p1Data.comments,p1Data.signers,p1Data.admin,p1Data.title) ).toString('base64');
    doc1.name = "Data";
    doc1.fileExtension = 'html';
    doc1.documentId = '6';

    env.documents = [doc1,doc2,doc3];

    

  
    // Create a signer recipient to sign the document, identified by name and email
    // We set the clientUserId to enable embedded signing for the recipient
    // We're setting the parameters via the object creation
    let signers = [];
    let signHeres = [];
    let signTabs = [];
    for(let i = 0; i<args.signers.length; i++){
        signers.push(
            docusign.Signer.constructFromObject({
                email: args.signers[i].signerEmail,
                name: args.signers[i].signerName, 
                clientUserId: args.signers[i].signerEmail + args.doc_id,
                recipientId: i + 1    
            })
        );
        signHeres.push(
            docusign.SignHere.constructFromObject({
            anchorString: `**signature_${i}**`,
            anchorYOffset: '10', anchorUnits: 'pixels',
            anchorXOffset: '20'
        })
        );

        signTabs.push(
            docusign.Tabs.constructFromObject({
                signHereTabs: [signHeres[i]]
            })
        );

        signers[i].tabs = signTabs[i];
    }
      
    // Add the recipient to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
      signers: signers});
    env.recipients = recipients;
  
    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    env.status = 'sent';
  
    return env;
}
function makeRecipientViewRequest(args) {
    // Data for this method
    // args.dsReturnUrl 
    // args.signerEmail 
    // args.signerName 
    // args.signerClientId
    // args.dsPingUrl 

    let viewRequest = new docusign.RecipientViewRequest();

    // Set the url where you want the recipient to go once they are done signing
    // should typically be a callback route somewhere in your app.
    // The query parameter is included as an example of how
    // to save/recover state information during the redirect to
    // the DocuSign signing ceremony. It's usually better to use
    // the session mechanism of your web framework. Query parameters
    // can be changed/spoofed very easily.
    viewRequest.returnUrl = args.dsReturnUrl + "?state=123";

    // How has your app authenticated the user? In addition to your app's
    // authentication, you can include authenticate steps from DocuSign.
    // Eg, SMS authentication
    viewRequest.authenticationMethod = 'none';
    
    // Recipient information must match embedded recipient info
    // we used to create the envelope.
    viewRequest.email = args.signerEmail;
    viewRequest.userName = args.signerName;
    viewRequest.clientUserId = args.clientUserId;

    // DocuSign recommends that you redirect to DocuSign for the
    // Signing Ceremony. There are multiple ways to save state.
    // To maintain your application's session, use the pingUrl
    // parameter. It causes the DocuSign Signing Ceremony web page
    // (not the DocuSign server) to send pings via AJAX to your
    // app,
    //viewRequest.pingFrequency = 600; // seconds
    // NOTE: The pings will only be sent if the pingUrl is an https address
    //viewRequest.pingUrl = args.dsPingUrl; // optional setting//

    return viewRequest
}

/*--------
    FUNCTION : make signature page (HTML)
---------- */
function makeHTMLSignPage(args) {


    let part1 = `<!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family:sans-serif;margin-left:2em;">
        <p>Signatures</p>
        `;
    
    let part2 = ``;
    for(let i =0 ; i < args.length; i++){
        part2 += `<h4> Reviewer ${args[i].signerName} </h4>
        <p style="margin-top:0em; margin-bottom:0em;">Email: ${args[i].signerEmail}</p>
        <h3 style="margin-top:3em;">Signed: <span style="color:white;">**signature_${i}**/</span></h3>
        `;
    }

    let part3 = `</body></html>`
   
    return part1 + part2 + part3;
  }

/*
  --- FUNCTION : Make comments table 
*/
function makeCommentsPage(comments,signers, admin,title){

    
    let part1 = `<!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family:sans-serif;margin-left:2em;">
        <h1 style = "width:100%;text:center"> ${title} </h1>
        <h4> ADMIN : ${admin}</h4>
        <h4> Reviewers </h4>`;
    let part2 = ``;
    for(let i = 0; i < signers.length; i++){
        part2 += `<p>${signers[i].signerName} </p>`
    }

    let part3 = `<h4> Review comments</h4><table style = "width:100%">
    <tr>
        <th> Comment Title </th>
        <th> Created by </th>
        <th> On </th>
        <th> Description </th>
        <th> Status </th>
    </tr>`;
    for(let i = 0; i<comments.length;i++){
        part3 += `<tr>
            <td> ${comments[i].title} </td>
            <td> ${comments[i].created.by} </td>
            <td> ${comments[i].created.on} </td>
            <td> ${comments[i].description} </td>
            <td> ${comments[i].status.status} </td>
        </tr>`
    }
    part3 += `</table>`
    
    return part1 + part2 + part3 + '</table></body></html>';  
}
// ------------- UTILITY -------------------

let dsApiClient = new docusign.ApiClient();
dsApiClient.setBasePath(basePath);
dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + token);
router.post('/', async (req,res) =>{

    let envelopesApi = new docusign.EnvelopesApi(dsApiClient)
        , results = null;

    // Make the envelope request body
    const args = {
        accountId : apiAccountId,

        envelopeArgs:{
            signerEmail : 'sdmuhsin@gmail.com',
            signerName : 'dum',
            signerClientId : 'sdmuhsin@gmail.com'
        }
    }
    let envelope = makeEnvelope(args.envelopeArgs)

    // Call Envelopes::create API method
    // Exceptions will be caught by the calling function
    results = await envelopesApi.createEnvelope(args.accountId, {envelopeDefinition: envelope});    
    console.log("Result of envelope creation : ");
    console.log(results);

    res.json(results);
});

router.post('/recipient', async (req,res)=>{
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient);
    const args = {
        signerEmail : 'sdmuhsin@gmail.com',
        signerName : 'dum',
        signerClientId : 'sdmuhsin@gmail.com',
        dsReturnUrl : 'http://localhost:3000/'
    }

    const viewRequest = makeRecipientViewRequest(args);
    console.log(viewRequest);

    console.log("Creating recipient view");
    results = await envelopesApi.createRecipientView(apiAccountId, 'c8afc1e8-43cc-4e93-a6b4-f7ef95eeced1',
        {recipientViewRequest: viewRequest});
    
   console.log(results)
    res.json({envelopeId: 'c8afc1e8-43cc-4e93-a6b4-f7ef95eeced1', redirectUrl: results.url});
});

router.post('/create', async(req,res) => {
    /*
        doc_id
    */
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient)
    , results = null;
    if(!!req.session.email){
        // Get document from mongo
        let doc = await  Document.findOne({_id:req.body.doc_id}).exec().catch((e)=>{console.log(e);res.status(500).json(e);})
        
        // Get the PNG
        if( doc.history.length != 0){
            console.log("Searching for checkpoint : ", doc.history[ doc.history.length - 1 ].checkpoint_id);
            let checkpoint = await Checkpoint.findOne({_id : doc.history[ doc.history.length - 1 ].checkpoint_id}).exec().catch((e)=>{console.log(e);res.status(500).json(e);})
            console.log(checkpoint.img_b64.slice(0,5));
            // Make an envelope

            const args = {
                signers:doc.docSigners,
                img_b64:checkpoint.img_b64
            };
            args.doc_id = req.body.doc_id;

            let page1Data = {
                signers : doc.docSigners,
                comments: doc.comments,
                admin: doc.adminName,
                title:doc.docTitle
            }
            const env = makeEnvelope(args,page1Data);
            let results = await envelopesApi.createEnvelope(apiAccountId, {envelopeDefinition: env}).catch(e=>{console.log(e)});
            console.log(results);
            if(results.status == 'sent'){
                // Update the envelope if in mongodb
                let ans = await Document.updateOne({_id:req.body.doc_id},{envelopeStatus:true,envelopeId:results.envelopeId,status:"SIGNATURE PHASE"}).catch(e=>{console.log(e);res.status(500).json(e);});
                console.log("FINAL : ",ans);
                res.status(200).json({
                    env:results,
                    doc:ans
                });
            }
            else{
                res.status(500).json(results);
            }
            
            
        }
        else{
            res.status(404).json({msg:"No checkpoints"});
        }
        // Make an envelope out of if
    }
    else{
        res.status(401).end();
    }
});

router.post('/sign', async(req,res) =>{
    if(!!req.session.email){
        // Get the document concerned
        let envelopesApi = new docusign.EnvelopesApi(dsApiClient)
        , results = null;
        let doc = await Document.findOne({_id:req.body.doc_id}).exec().catch(e=>{console.log(e);res.status(500).json(e);})
        // Find the user within the document
        let signer = {};
        for(let i = 0; i < doc.docSigners.length; i ++  ){
            if(doc.docSigners[i].signerEmail == req.session.email){
                signer.signerName = doc.docSigners[i].signerName;
                signer.signerEmail = doc.docSigners[i].signerEmail;
                signer.clientUserId = signer.signerEmail + req.body.doc_id;
            }
        }
        if(signer == {}){
            res.status(500).json({msg:"Could not find signer in document, signer email : " + req.session.email});
        }else{

            // Create recipient request
            signer.dsReturnUrl = 'http://localhost:3000/envelope/callback';
            console.log("Signer : ", signer);
            const viewRequest = makeRecipientViewRequest(signer);
            console.log(viewRequest);

            console.log("Creating recipient view");
            console.log("Envelope ID ", doc.envelopeId);
            if(doc.envelopeId == ""){
                res.status(404).json({msg:"No envelope ID"})
            }
            else{
                results = await envelopesApi.createRecipientView(apiAccountId, doc.envelopeId,
                {recipientViewRequest: viewRequest}).catch(e=>{console.log("ERROR CREATING RECIPIENT VIEW",e);});
            
                console.log(results)
                req.session.doc_id = req.body.doc_id;
                res.json({envelopeId:doc.envelopeId, redirectUrl: results.url});
            }
        }
    }
    else{
        res.status(401).end();
    }
});

router.get('/callback', async(req,res) =>{
    console.log("CALLBACK : ", req.session.doc_id, req.session.email);
    console.log(req.query.event);
    if(req.query.event == "signing_complete" || req.query.event == "viewing_complete"){
        console.log("SIGNING COMPLETE");

        // FInd document 
        let doc = await Document.updateOne(
            {   _id:req.session.doc_id,
                docSigners:{
                    $elemMatch: {
                        signerEmail: req.session.email
                    } 
                }
            },
            {
                "docSigners.$.signerSignStatus":true
            }  
            )    
        .exec().catch(e=>{console.log(e);res.status(500).json(e)})
        
        doc = await Document.findOne({_id:req.session.doc_id}).exec().catch(e=>{console.log(e)})
        console.log(doc);
        flag = 1;
        for(let i = 0; i < doc.docSigners.length; i++){
            if( !doc.docSigners[i].signerSignStatus ){
                flag = 0;
            }
        }
        if(flag){
            console.log("SIGNING COMPLETE, GENERATING DOWNLOAD LINK (JK NVM)");
            let ans = await Document.updateOne({_id:req.session.doc_id},{status:"COMPLETE",envelopeStatus:true}).exec().catch(e=>{console.log(e);})
            console.log(ans);
            
        }
        res.status(200).send(`<h4> Signing complete, return to <a href ="http://localhost:4200"> APP </a>  </h4>`);
    }

})
module.exports = router