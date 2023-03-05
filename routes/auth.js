var express = require('express');
var auth = require('../controller/auth.controller')

var router = express.Router();


router.post('/login',auth.login)
router.get('/status',auth.protect,auth.returnStatus)
router.get('/logOut',auth.logOut)
router.post('/queries',auth.queries);

module.exports = router;
