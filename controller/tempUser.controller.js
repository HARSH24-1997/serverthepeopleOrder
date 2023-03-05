const tempUser = require('../models/tempUsers');
const mongoose = require('mongoose')
const {catchAsync,createRandomPassword,mailOptions} = require('../utils/utils');
const sendMail = require('../utils/emailer');
const appErrors = require('../utils/errors');
const Employee = require('../models/employee');




exports.get = catchAsync(async function (req, res, next) {
    if (!req.query.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const userById = await tempUser.findById({ _id:  mongoose.Types.ObjectId(req.query.id)});

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
    const newUser = await tempUser.create(req.body);
    if(!newUser){
        return next(new appErrors('Some Error Occured', 404));
    }
    var options = {
        mailOption:mailOptions("NEW_TEMP_USER",req.body.email,req.body)
    }
    sendMail(options,req.body.email,req.body);
    return res.status(200).json(newUser);
});


exports.getAll = catchAsync(async function (req, res,next) {
    console.log("343434");
    let users = [];
        users = await tempUser.find();
        return res.status(200).json({
            users:users
        })
});


