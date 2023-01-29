class appErrors extends Error {
    constructor(message,statusCode){
        console.log(message,statusCode,"3343434", `${statusCode}`.startsWith('4') ? 'fail' : 'error');
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}


module.exports = appErrors;