var express = require('express');
var user = require('../controller/user.controller');

var router = express.Router();


router.post('/',user.create);
// router.get('/:id',user.get);
router.get('/getAll',user.getAll);

module.exports = router;
