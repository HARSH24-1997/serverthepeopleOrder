const moongoose = require('mongoose');
const validator = require('validator');

const mailLogsSchema = new moongoose.Schema({

    name:{
        type : String,
        require : [true,"Please tell us your name!"]
    },
    panCardId:{
        type : String,
        require : [true,"Please Provide a Password"]
    },
    adharCardId:{
        type : String,
    },
    isSent:Boolean,
    details:{},
    isDeleted:{
        type: Boolean,
        default : false
    },
    isActive:{
        type:Boolean,
        default : true
    },
    _created:Date,
    last_modified:Date,
});


const MailLogsSchema = moongoose.model('mailLogsSchema',mailLogsSchema);

module.exports = MailLogsSchema;