const moongoose = require('mongoose');
const validator = require('validator');

const empSchema = new moongoose.Schema({

    name:{
        type : String,
        require : [true,"Please tell us your name!"]
    },
    code:{
        type : String,
    },
    email:{
        type : String,
        require : [true,"Please provide your email!"], 
        lowercase : true,
        // validate : [validator,isEmail,"Please provide a valid Email"]
    },
    panCardId:{
        type : String,
        require : [true,"Please Provide a PanCard Information"]
    },
    aadharCardId:{
        type : String,
        require : [false,"Please Provide a Password"]
    },
    company_id:{
        type : String,
        require : [true,"Please Provide a Password"]
    },
    companyName:{
        type : String,
        require : [true,"Please Provide a Password"]
    },
    companyDetails :{},
    remarks :{
        type : String,
    },
    status :{
        type : String,
        require : true
    },
    phone :{
        type : String,
        require : true
    },
    updation:{

    },
    dateOfJoining:Date,
    dateOfOffer:Date,
    details:{},
    isDeleted:{
        type: Boolean,
        default : false
    },
    isActive:{
        type:Boolean,
        default : true
    },
    _created:{
        type:Date,
        default:Date.now()
    },

});

empSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    next();
})

const Employee = moongoose.model('Employee',empSchema);

module.exports = Employee;