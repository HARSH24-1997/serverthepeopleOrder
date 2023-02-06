
const Employee = require('../models/employee');
const aggregate = require('../models/aggregate');
const mongoose = require('mongoose')
const {catchAsync,createRandomPassword,mailOptions} = require('../utils/utils');
const sendMail = require('../utils/emailer');
const appErrors = require('../utils/errors');

// utils 

function alreadyExistingAndSendMail(alreadyArray , currentArray){
    createAggregate(currentArray);
    Promise.all(alreadyArray.map(async (employee)=>{
        console.log(employee)
        let options = {
            mailOption:mailOptions("EMP_EXIT","rajput16.harsh@gmail.com",employee)
        }
        console.log(options,employee);
        await sendMail(options,"rajput16.harsh@gmail.com",employee);
    }))
}

function createAggregate (latestEmp){

}

exports.create = async function(req,res,next){
    if(!req.body.name){
        return next(new appErrors('Missing Employee Name', 404));
    }
    if(!req.body.email){
        return next(new appErrors('Missing Email Id', 404));
    }
    if(!req.body.panCardId){
        return next(new appErrors('Missing PanCard Information', 404));
    }
    // if(!req.body.company_id){
    //     return next(new appErrors('Missing Company Information', 404));
    // }
    if(!req.body.status){
        return next(new appErrors('Missing Employee Status', 404));
    }
    // if(!req.body.createdBy){
    //     return next(new appErrors('Missing Subdomain ', 404));
    // }
    // if(req.body.isSuperAdmin){
    //     return next(new appErrors('Sorry .... You are not that cool !!! Just Smileeeeee !!!! ', 404)); 
    // }
    const newEmp = await Employee.create(req.body);
    if(newEmp){
        const exitInAnother = await Employee.find({panCardId:newEmp.panCardId,status:{$ne:"closed"}});
        console.log(exitInAnother,"51");
        if(exitInAnother.length>1){
            alreadyExistingAndSendMail(exitInAnother,newEmp);
        }
        else{
            return res.status(200).json(newEmp);
        }
    }
    if(!newEmp){
        return next(new appErrors('Some Error Occured', 404));
    } 
}

exports.update = async function(req,res){
    if (!req.body.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const updateUser = await Employee.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, req.body, { new: true });
    if(updateUser){
        return res.status(200).json({ "msg": "Updated Succesfully" })
    }
    else next (new appErrors('Unable To update the user',404));
}

exports.updateStatus = async function(req,res){
    if (!req.body.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const updateUser = await Employee.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, {status:req.body.status}, { new: true });
    if(updateUser){
        return res.status(200).json({ "msg": "Updated Succesfully" })
    }
    else next (new appErrors('Unable To update the user',404));
}

exports.delete =  async function(req,res){
    if (!req.body.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const updateUser = await Employee.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body.id) });
    if(updateUser){
        return res.status(200).json({ "msg": "Updated Succesfully" })
    }
    else next (new appErrors('Unable To update the user',404));
}

exports.get = async function(req,res){
    console.log("get")
    if (!req.params.id) {
        return next(new appErrors('Please Provide user Id ', 404));
    }
    const userById = await User.findById({ _id:  mongoose.Types.ObjectId(req.params.id)});

    if(!userById){
        return next(new appErrors('User Not Found With this Id', 404));
    }
    return res.status(200).json(userById);
}

exports.getEmployeesByCompany = catchAsync (async function(req,res,next){
    console.log(req.query)
    if(!req.query.id){
        return next(new appErrors('Please Provide the company Id'))
    }

    const employees = await Employee.find({company_id:req.query.id})
    console.log(employees)
    if(!employees){
        return next(new appErrors('Unable to find it ',404))
    }
    return res.status(200).json({data:employees}) 
})
