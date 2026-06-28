let express = require("express");
const { adminLogin,adminCookeieCheck } = require("../../Controller/Admin/adminLogin");
let multer=require('multer');
const { changePass, verifyOtp } = require("../../Controller/Admin/authAdmin");

let adminAuthRoutes = express.Router();
const upload=multer()
//http://localhost:8000/admin/job/add

adminAuthRoutes.post('/login',upload.none(), adminLogin)
adminAuthRoutes.get('/login/:id', adminCookeieCheck)

adminAuthRoutes.post('/pass',changePass)
adminAuthRoutes.post('/verify-otp',verifyOtp)


module.exports={adminAuthRoutes};