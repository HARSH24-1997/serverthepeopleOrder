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
        unique: true,
        lowercase : true,
        validate : [validator,isEmail,"Please provide a valid Email"]
    },
    panCard:{
        type : String,
        require : [true,"Please Provide a Password"]
    },
    adharCard:{
        type : String,
        require : [true,"Please Provide a Password"]
    },
    voterIdCard:{
        type : String,
        require : [true,"Please Provide a Password"]
    },
    confirmPassword:{
        type : String,
        require : [true,"Please Provide a Password"]
    },
    currentCompany :{
        type : String,
        require : true
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


const User = moongoose.model('User',userSchema);

module.exports = User;