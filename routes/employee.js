var express = require('express');
var employee = require('../controller/employee.controller')
var router = express.Router();


router.post('/',employee.create);
router.get('/getAll?:id',employee.getEmployeesByCompany);
router.get('/getById?:id',employee.get);
router.put('/updateUser',employee.update)

module.exports = router;
