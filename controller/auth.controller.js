const User = require('../models/user');
const JsonWebToken = require('jsonwebtoken');
const Util = require('util');
const appErrors = require('../utils/errors');
const {catchAsync,createRandomPassword,mailOptions} = require('../utils/utils');
const sendMail = require('../utils/emailer');

// For Login New User
exports.login = catchAsync(async function (req, res, next) {
    const { username, password } = req.body;
    if (!username && !password) {
        return next(new appErrors("Incomplete Information", 400))
    }
    var query = {
        email: username,
    }
    const user = await User.findOne(query).select("+password");
    const validity = new Date(user.expiryDate).getTime();
    const threshold = new Date().getTime();
    console.log(user,"20")
    if (!user || !await user.correctPassword(user.password, password)) {
        next(new appErrors("Incorrect Username or Password", 400));
    }
    else {
        const token = signToken(user._id);
         res.cookie('jwt', token, {
            expiresIn: 24 * 60 * 60 * 60 * 1000,
            httpOnly: true
        })
        if(!user.isActive){
            next(new appErrors("User is Inactive by Admin", 404));  
        }
        if(!user.isSuperAdmin && (validity < threshold)){
            next(new appErrors("User is Inactive by Admin", 404));  
        }
        res.status(200).json({msg:'login successful',isSuperAdmin:user.isSuperAdmin,token:token})
    }
})

//For Creating a new user

exports.logOut = async function(req,res,next){
    res.cookie('jwt',"logOut" , {
        expiresIn: 10000,
        httpOnly: true
    })
    res.status(200).json({msg:'Successful LogOut'})
}

//Reseting the Password

exports.resetPassword = function(req,res){
    if(req.body.username){

    }
    if(req.body.password){

    }
    if(req.body.subdomain){

    }
    
}

//Auth middleware

exports.protect =  catchAsync (async function(req,res,next){
    console.log("Im protector")
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    console.log(token,req.headers.authorization)
    if(!token){
        return next(new appErrors('Invalid Request',404))
    }
    let correct = await Util.promisify(JsonWebToken.verify)(token,process.env.JWT_SECERET);

    const freshUser =await  User.findById(correct.id);
    if(!freshUser){
        return next(new appErrors('Invalid Request',404))
    // user doesn't login 
    }
    console.log(correct);
    req.user=freshUser;
    next();
})

//Middleware for SuperAdmin 

exports.returnStatus = function(req,res,next){
    console.log(req.user);
    let isSigned = false;
    let isSuperAdmin = undefined;
    if(req.user.isActive){
        isSigned = true
    }
    if(req.user.isSuperAdmin){
        isSuperAdmin = true
    }
    return res.status(200).json({   
        isSigned:isSigned,
        isSuperAdmin:isSuperAdmin,
        user:req.user
    })

}


//Sign Token 

const signToken = id =>{
    return  JsonWebToken.sign({id:id},process.env.JWT_SECERET,{
        expiresIn:process.env.JWT_EXPIRE_IN
    })
}


//Queries Mail 


exports.queries = catchAsync(async function(req,res,next){
    var options = {
        mailOption:mailOptions("Queries","rajput16.harsh@gmail.com",req.body)
    }
    sendMail(options,"rajput16.harsh@gmail.com",req.body);
    return res.status(200).json(newUser);
})