
const Employee = require('../models/employee');
const aggregate = require('../models/aggregate');
const mongoose = require('mongoose')
const { catchAsync, createRandomPassword, mailOptions } = require('../utils/utils');
const sendMail = require('../utils/emailer');
const appErrors = require('../utils/errors');

// utils 


//Status 
// 1. Offer Accepted
// 2. Offer Joined
// 3. Rejcted 
// 4. Join and Leave 
// 5. Absocord 


function alreadyExistingAndSendMail(alreadyArray, currentArray) {
    createAggregate(alreadyArray,currentArray);
    Promise.all(alreadyArray.map(async (employee) => {
        console.log(employee)
        let options = {
            mailOption: mailOptions("EMP_EXIT", "rajput16.harsh@gmail.com", employee)
        }
        console.log(options, employee);
        await sendMail(options, "rajput16.harsh@gmail.com", employee);
    }))
}

async function createAggregate(alreadyArray,latestEmp) {
   const aggregates =  aggregate.find({
        $or:
            [{ adharCardId: latestEmp.adharCardId }, { adharCardId: latestEmp.panCardId }]
    })
    var query = {
        name:latestEmp.name,
        email:latestEmp.email,
        adharCardId:latestEmp.panCardId,
        adharCardId:latestEmp.adharCardId?latestEmp.adharCardId:'',
        last_modified:new Date(),
        _created:new Date(),
        details:{}
    }
    if(aggregates.length>0){
        for(var i=0;i<alreadyArray.length;i++){
            query.details[i] = {
                company_id:alreadyArray[i].company_id,
                companyName:alreadyArray[i].companyName,
                dateOfJoining:alreadyArray[i].dateOfJoining,
                dateOfOffer:alreadyArray[i].dateOfOffer,
                status:alreadyArray[i].status
            }
        }
       await aggregate.create(query);
    }
    else{
        for(var i=0;i<alreadyArray.length;i++){
            query.details[i] = {
                company_id:alreadyArray[i].company_id,
                companyName:alreadyArray[i].companyName,
                dateOfJoining:alreadyArray[i].dateOfJoining,
                dateOfOffer:alreadyArray[i].dateOfOffer,
                status:alreadyArray[i].status
            }
        }
       await aggregate.create(query);
    }

}

exports.create = async function (req, res, next) {
    if (!req.body.name) {
        return next(new appErrors('Missing Employee Name', 404));
    }
    if (!req.body.email) {
        return next(new appErrors('Missing Email Id', 404));
    }
    if (!req.body.panCardId) {
        return next(new appErrors('Missing PanCard Information', 404));
    }
    if (!req.body.company_id) {
        return next(new appErrors('Missing Company Information', 404));
    }
    if (!req.body.status) {
        return next(new appErrors('Missing Employee Status', 404));
    }
    // if(!req.body.createdBy){
    //     return next(new appErrors('Missing Subdomain ', 404));
    // }
    const newEmp = await Employee.create(req.body);
    if (newEmp) {
        const exitInAnother = await Employee.find({
            panCardId: newEmp.panCardId, status: { $nin : [ 3, 4, 5 ] }, dateOfJoining: {
                $gt: new Date()
            }
        });
        if (exitInAnother.length > 1) {
            alreadyExistingAndSendMail(exitInAnother, newEmp);
        }
        else {
            return res.status(200).json(newEmp);
        }
    }
    if (!newEmp) {
        return next(new appErrors('Some Error Occured', 404));
    }
}

exports.update = catchAsync(async function (req, res, next) {
    if (!req.body.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    var id = req.body.id;
    delete req.body.id
    const updateUser = await Employee.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, req.body, { new: true });
    console.log(updateUser, "72")
    if (updateUser) {
        return res.status(200).json({ "msg": "Updated Succesfully" })
    }
    else next(new appErrors('Unable To update the user', 404));
})

exports.updateStatus = async function (req, res) {
    if (!req.body._id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const updateUser = await Employee.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, { isActive: req.body.isActive }, { new: true });
    console.log(updateUser)
    if (updateUser) {
        return res.status(200).json({ "msg": "Updated Succesfully" })
    }
    else next(new appErrors('Unable To update the user', 404));
}

exports.delete = async function (req, res) {
    if (!req.body.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const updateUser = await Employee.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body.id) });
    if (updateUser) {
        return res.status(200).json({ "msg": "Updated Succesfully" })
    }
    else next(new appErrors('Unable To update the user', 404));
}

exports.get = catchAsync(async function (req, res, next) {
    console.log("get", req.query, req.params)
    if (!req.query.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const userById = await Employee.findById({ _id: mongoose.Types.ObjectId(req.query.id) });

    if (!userById) {
        return next(new appErrors('Employee Not Found With this Id', 404));
    }
    return res.status(200).json(userById);
})

exports.getEmployeesByCompany = catchAsync(async function (req, res, next) {
    console.log(req.query)
    if (!req.query.id) {
        return next(new appErrors('Please Provide the company Id'))
    }

    const employees = await Employee.find({ company_id: req.query.id })
    console.log(employees)
    if (!employees) {
        return next(new appErrors('Unable to find it ', 404))
    }
    return res.status(200).json({ data: employees })
})

exports.reportDataSet1 = catchAsync(async function(req,res,next){
    var query = await Employee.find();
    query.count(function(err,count){
        if(err){
            return next(new appErrors("Sorry Wrong Api",404))
        }
        else{
            return res.status(200).json({
                Employee:count
            })
        }
    })
})

exports.reportDataSet2 = catchAsync(async function(req,res,next){
   var result =[];
    var cursor = await Employee.aggregate([
       {
           $group: {
               _id: {
                   "company_id":"$company_id"
               },
               count:
                   { "$sum": 1 }
           }
       }
    ])
        return res.status(200).json({
            data:cursor
        })
})

exports.reportDataSet3 = catchAsync(async function(req,res,next){
    var result =[];
     var cursor = await Employee.aggregate([
        {
            $group: {
                _id: {
                    "company_id":"$company_id",
                    "status":"$status"
                },
                count:
                    { "$sum": 1 }
            }
        }
     ])
         return res.status(200).json({
             data:cursor
         })
 })

 
exports.reportDataSet3 = catchAsync(async function(req,res,next){
    var result =[];
    var query = {
        company_id:req.body.company_id
    }
     var cursor = await Employee.aggregate([
        {
            $match:query
        },
        {
            $group:{
                "_id":{
                    "status":"$status"
                },
                count:
                    { "$sum": 1 }
            }
        }
     ])
         return res.status(200).json({
             data:cursor
         })
 })