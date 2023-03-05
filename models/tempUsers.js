const moongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const tempUserSchema = new moongoose.Schema({

    companyName:{
        type : String,
        require : [true,"Please tell us your name!"]
    },
    email:{
        type : String,
        require : [true,"Please provide your name!"],
        unique: true,
        lowercase : true,
        // validate : [validator,isEmail,"Please provide a valid Email"]
    },
    password:{
        type : String,
        require : [true,"Please Provide a Password"],
        select : false
    },
    // confirmPassword:{
    //     type : String,
    //     require : [true,"Please Provide a Password"]
    // },
    // subdomain :{
    //     type : String,
    //     require : true
    // },
    details:{},
    isDeleted:{
        type: Boolean,
        default : false
    },
    // isActive:{
    //     type:Boolean,
    //     default : true
    // },
    createdBy:{},
    _created:{
        type:Date,
        default:Date.now()
    },
    phone:{
        type : String,
        require : true
    },
    // expiryDate:Date,
    // isSuperAdmin:Boolean,
    last_modified:Date,
    // last_password_change:Date
});


// userSchema.pre('save',async function(next){
//     if(!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password,12);
//     next();
// })

// userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
//     return await bcrypt.compare(userPassword,candidatePassword)
// }

// userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
//     if(this.last_password_change)
//     return await
// }

const TempUser = moongoose.model('TempUser',tempUserSchema);

module.exports = TempUser;