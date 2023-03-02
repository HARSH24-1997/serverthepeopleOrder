const User = require('../models/user');
const mongoose = require('mongoose')
const {catchAsync,createRandomPassword,mailOptions} = require('../utils/utils');
const sendMail = require('../utils/emailer');
const appErrors = require('../utils/errors');
const Employee = require('../models/employee');




exports.get = catchAsync(async function (req, res, next) {
    if (!req.query.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const userById = await User.findById({ _id:  mongoose.Types.ObjectId(req.query.id)});

    if(!userById){
        return next(new appErrors('User Not Found With this Id', 404));
    }
    return res.status(200).json(userById);
});

exports.create = catchAsync(async function (req, res,next) {
    if(!req.body.companyName){
        return next(new appErrors('Missing Company Name', 404));
    }
    if(!req.body.email){
        return next(new appErrors('Missing Email Id', 404));
    }
    if(req.body.isSuperAdmin){
        return next(new appErrors('Sorry .... You are not that cool !!! Just Smileeeeee !!!! ', 404)); 
    }
    if(req.body.expiryDate){
        return next(new appErrors('Missing Expiry Date', 404)); 
    }
    req.body.password = createRandomPassword();
    const newUser = await User.create(req.body);
    if(!newUser){
        return next(new appErrors('Some Error Occured', 404));
    }
    var options = {
        mailOption:mailOptions("NEW_USER",req.body.email,req.body)
    }
    sendMail(options,req.body.email,req.body);
    return res.status(200).json(newUser);
});

exports.delete = async function (req, res) {
    if (!req.query._id) {
        return res.status(400).json({"err":"please provide thre id"});
    }
    else{
       const userById = await User.findByIdAndUpdate({_id:mongoose.Types.ObjectId(req.query._id),isDeleted:true});
       console.log(userById,"11");
       return res.status(200).json(userById);
    }
}

exports.update = catchAsync(async function (req, re) {
    if (!req.body.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const updateUser = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, req.body, { new: true });
    if(updateUser){
        return res.status(200).json({ "msg": "Updated Succesfully"  })
    }
    else next (new appErrors('Unable To update the user',404));
});

exports.updateStatus = catchAsync(async function(req,res,next){
    console.log(req.body)
    if (!req.body._id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const updateUser = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, req.body, { new: true });
    console.log(updateUser)
    if(updateUser){
        return res.status(200).json({ "msg": "Updated Succesfully" })
    }
    else next (new appErrors('Unable To update the user',404));
});


exports.getAll = catchAsync(async function (req, res,next) {
    console.log("343434");
    let users = [];
    var query = {
        isSuperAdmin: {
            $eq: false
        }
    }
    var superAdmin = req.body.isSuperAdmin;
    console.log(superAdmin);
    superAdmin = true;
    if (superAdmin) {
        users = await User.find({query},{_id:1,companyName:1,createdBy:1,isActive:1,details:1,email:1,expiryDate:1});
        return res.status(200).json({
            users:users
        })
    }
    else {
        return next(new appErrors("Sorry Wrong Api",404))
    }
});


exports.getByToken = catchAsync(async function(req,res,next){
    return res.status(200).json(req.user);
})

exports.reportDataSet1 = catchAsync(async function(req,res,next){
        var query = await User.find();
        query.count(function(err,count){
            if(err){
                return next(new appErrors("Sorry Wrong Api",404))
            }
            else{
                return res.status(200).json({
                    userscount:count - 1
                })
            }
        })
})

exports.reportDataSet2 = catchAsync(async function(req,res,next){

})