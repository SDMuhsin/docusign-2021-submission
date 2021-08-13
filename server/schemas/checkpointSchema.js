const mongoose = require('mongoose');
const CheckpointSchema = new mongoose.Schema({
    img_b64 : String
})
module.exports =  Checkpoint = mongoose.model('Checkpoint',CheckpointSchema,'checkpoints');