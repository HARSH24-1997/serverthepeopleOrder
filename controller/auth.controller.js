const User = require('../models/user');
const JsonWebToken = require('jsonwebtoken');
const Util = require('util');
const appErrors = require('../utils/errors');

// For Login New User
exports.login = async function (req, res, next) {
    const { username, password } = req.body;
    if (!username && !password) {
        return next(new appErrors("Incomplete Information", 400))
    }
    var query = {
        email: username,
    }
    const user = await User.findOne(query).select("+password");
    if (!user || !await user.correctPassword(user.password, password)) {
        next(new appErrors("Incorrect Username or Password", 400));
    }
    else {
        const token = signToken(user._id);
        console.log(token,"21");
        return res.cookie('jwt', token, {
            expiresIn: 24 * 60 * 60 * 1000,
            httpOnly: true
        })
    }
}

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

exports.protect = async function(req,res,next){
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split('')[1]
    }
    if(!token){

    }
    let correct = await Util.promisify(JsonWebToken.verify)(token,JWT_SECERET);

    const freshUser =await  User.findById(correct.id);
    if(!freshUser){
        // user doesn't login 
    }
    console.log(correct);
    req.user=freshUser;
    next();
}

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

