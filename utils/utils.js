const appErrors = require("./errors");

exports.catchAsync = fn => {
    return (req,res,next) => {
        fn(req,res,next).catch(err => next(new appErrors(err,500)));
    }
}


//Random Password Generator;
exports.createRandomPassword = () => Math.random().toString(36).slice(-8); 

exports.mailOptions = (type,toSend,data) => {
    console.log(data)
    const mailOption = {
        from: "thePeopleOrder <rajput16.harsh@gmail.com>",
        to: toSend,
        subject: "",
        text: "",
        html: "",
    }
    if(type=="NEW_USER"){
        mailOption.subject="Your thePeopleOrder account has been Created";
        mailOption.html = "<table><tbody><tr><th>Welcome to thePeopleOrder</th></tr><tr><td>Hii " +`${data.companyName}` +  "</td></tr><tr><td>Your account is activated and your<b> Username</b> is " + `${data.email}` + "and <b> Password </b>" + ` ${data.password}` +"</td></tr><tr><td>For Any Further queries please contact thePeopleOrder +9123242345343</td></tr></tbody></table>"
        return mailOption
    }
    if(type=="NEW_TEMP_USER"){
        mailOption.subject="Hurray !! New Company Wants To Register With The People Order ";
        mailOption.html = "<table><tbody><tr><th>New Clients Information </th></tr><tr><td>Hii I'm From " +`${data.companyName}` + " and of type " + `${data.companyType}` +  " and my email address is " + `${data.email}` +  " and you contact me on " + `${data.phone}` + " I'm waiting for your call " +  "</td></tr></tbody></table>"
        return mailOption
    }
    if(type=="EMP_EXIT"){
        mailOption.subject="Employee STATUS caught up,that you just ADDED";
        mailOption.html = "<table><tbody><tr><th>Hi</th></tr><tr><td>Hii " +`${data.companyName}` +  "</td></tr><tr><td>Employee Caught <b> Employee Name</b> is " + `${data.name}` + "and <b> got a job in another company </b>" +"</td></tr><tr><td>For Any Further queries please contact thePeopleOrder +9123242345343</td></tr></tbody></table>"
        return mailOption
    }
    if(type=="QUERIES"){
        mailOption.subject=`${data.subject}`;
        mailOption.html = "<table><tbody><tr><th>Hi</th></tr><tr><td>Hii MySelf " +`${data.Name}` +  "</td></tr><tr><td>My Email </b> is " + `${data.email}` + "and <b> I have a queries </b>" +"</td></tr><tr><td>" + `${data.queries}` + "</td></tr></tbody></table>"
        return mailOption
    }
}
//is Operational

//Cast Error


//Duplicate Error  // 1100

//(["'])(?:(?=(\\?))\2.)*?\1


//handle valiadatation error 