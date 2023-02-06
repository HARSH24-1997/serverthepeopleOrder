var express = require('express');
var employee = require('../controller/employee.controller')
var router = express.Router();


router.post('/',employee.create);
// router.get('/:id',user.get);
router.get('/getAll?:id',employee.getEmployeesByCompany);

module.exports = router;
