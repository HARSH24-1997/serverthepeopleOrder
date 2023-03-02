var express = require('express');
var employee = require('../controller/employee.controller')
var router = express.Router();


router.post('/',employee.create);
router.get('/getAll?:id',employee.getEmployeesByCompany);
router.get('/getById?:id',employee.get);
router.put('/updateUser',employee.update);
router.get('/dataset',employee.reportDataSet1)
router.get('/countOffer',employee.reportDataSet1)
router.get('/countEmployee',employee.reportDataSet1)
router.get('/countFalseOffer',employee.reportDataSet1)


module.exports = router;
