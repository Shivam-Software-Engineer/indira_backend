let multer=require('multer');
let express = require("express");
const { register, otp, login } = require('../../Controller/Website/authentication');



let Authentication = express.Router();




Authentication.post('/register', register)
Authentication.post('/otp', otp)

Authentication.post('/login', login)


module.exports={Authentication};