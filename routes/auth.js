var express = require('express');
var auth = require('../controller/auth.controller')

var router = express.Router();


router.post('/login',auth.login)


module.exports = router;
