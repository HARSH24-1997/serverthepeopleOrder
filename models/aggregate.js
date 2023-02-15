const moongoose = require('mongoose');
const validator = require('validator');

const aggregateSchema = new moongoose.Schema({

    name:{
        type : String,
        require : [true,"Please tell us your name!"]
    },
    email:{
        type : String,
        require : [true,"Please provide your name!"],
        lowercase : true,
        // validate : [validator,isEmail,"Please provide a valid Email"]
    },
    panCardId:{
        type : String,
        require : [true,"Please Provide a Password"]
    },
    adharCardId:{
        type : String,
    },
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


const Aggregate = moongoose.model('Aggregate',aggregateSchema);

module.exports = Aggregate;