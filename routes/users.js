var express = require('express');
var user = require('../controller/user.controller');
var auth = require('../controller/auth.controller');
var router = express.Router();


router.post('/',user.create);
router.get('/getById?:id',user.get);
router.get('/getAll',user.getAll);
router.get('/getMe',auth.protect,user.getByToken);
router.put('/updateStatus',auth.protect,user.updateStatus);


module.exports = router;
