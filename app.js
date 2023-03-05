var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var dotenv = require('dotenv')
var cors = require('cors');
var appError = require('./utils/errors');


dotenv.config({path:'./config.env'});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var employeeRouter = require('./routes/employee');
var tempUsersRouter = require('./routes/tempUsers')

var DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connect(DB,{
  useNewUrlParser:true,
}).then(con=>{
  console.log(con.connection)
  console.log('DB connection succesful');
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  credentials: true,
  origin: ["https://thepeopleorderdash.netlify.app","http://localhost:4200"],
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', usersRouter);
app.use('/employee', employeeRouter);
app.use('/tempUser',tempUsersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  if(process.env.stage=="Development"){
    res.status(err.statusCode).json({
      status:err.status,
      statusCode:err.statusCode,
      msg:err.message,
      stack:err.stack
    })
  }
  else if(process.env.stage=="Staging"){
    res.status(err.statusCode).json({
      status:err.status,
      msg:err.message,
      statusCode:err.statusCode,
      stack:err.stack
    })
  }
  else{
    res.status(err.statusCode).json({
      status:err.status,
      msg:err.message,
      statusCode:err.statusCode,
    })
  }


 
});

module.exports = app;
