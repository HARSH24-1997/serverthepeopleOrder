const User = require('../models/user');
const JsonWebToken = require('jsonwebtoken');
const Util = require('util');
const appErrors = require('../utils/errors');
const {catchAsync,createRandomPassword,mailOptions} = require('../utils/utils');


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
    console.log(user)
    if (!user || !await user.correctPassword(user.password, password)) {
        next(new appErrors("Incorrect Username or Password", 400));
    }
    else {
        const token = signToken(user._id);
        console.log(token,"21");
         res.cookie('jwt', token, {
            expiresIn: 24 * 60 * 60 * 60 * 1000,
            httpOnly: true
        })
        res.status(200).json({msg:'login successful',isSuperAdmin:user.isSuperAdmin,token:token})
    }
})

//For Creating a new user

exports.signUp = async function(req,res,next){
    if(req.body.username){

    }
    if(req.body.password){

    }
    if(req.body.subdomain){

    }

    var query = {

    }

    const newUser = await User.create(query);
    const token = signToken(newUser._id)
    return res.status(201).json({
        msg:"Success",
        token:token,
        data : newUser
    })
    
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


exports.superAdmin = function(req,res,next){
    if(req.isSuperAdmin){
        next();
    }
    else{

    }

}

//Sending Password Mail

const sendPasswordMail= () =>{

}

//Sign Token 

const signToken = id =>{
    return  JsonWebToken.sign({id:id},process.env.JWT_SECERET,{
        expiresIn:process.env.JWT_EXPIRE_IN
    })
}

