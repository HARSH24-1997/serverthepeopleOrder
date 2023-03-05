var express = require('express');
var tempUser = require('../controller/tempUser.controller');
var auth = require('../controller/auth.controller');
var router = express.Router();


router.post('/',tempUser.create);
router.get('/getAll',tempUser.getAll);
router.get('/getById?:id',tempUser.get);


module.exports = router;
