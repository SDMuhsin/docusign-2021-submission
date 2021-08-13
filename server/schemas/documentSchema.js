const mongoose = require('mongoose');
// ------- SCHEMA ---------//
const DocumentSchema = new mongoose.Schema({
    docTitle: String,
    docMapUrl:String,
    docSigners: {
        type : [
            {
                signerName:String,
                signerEmail:String,
                signerApprovalStatus:String,
                signerEditAccess:{type:Boolean,default:false},
                requestingAccess:{type:Boolean,default:false},
                signerSignStatus:{type:Boolean,default:false}
            }
        ]
    },
    adminEmail:String,
    adminName:String,
    status:String,
    history:[mongoose.Schema.Types.Mixed],
    comments:[mongoose.Schema.Types.Mixed],
    currentHistoryIndex:Number,
    envelopeStatus:{type:Boolean,default:false},
    envelopeId:{type:String,default:""},
    envelopeDownloadUrl:{type:String,default:""}
  });
module.exports =  Document = mongoose.model('Document',DocumentSchema,'map_documents');