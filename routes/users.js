var express = require('express');
var user = require('../controller/user.controller');
var auth = require('../controller/auth.controller');
var router = express.Router();


router.post('/',user.create);
// router.get('/:id',user.get);
router.get('/getAll',user.getAll);
router.get('/getMe',auth.protect,user.getByToken);

module.exports = router;
