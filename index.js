require("dotenv").config();
const {adminRoutes} = require("./App/Routes/AdminRoutes");
let express = require("express");
let mongoose = require("mongoose");
let App = express();
let cors = require("cors");
const { websiteRoutes } = require("./App/Routes/WebsiteRoutes");
const { adminLoginModel } = require("./App/Model/Admin_Model/adminLogin");
App.use(cors());
App.use(express.json());
App.use("/Uploads/Resumes", express.static("Uploads/Resumes"))



//http://localhost:8000/admin/
App.use('/admin', adminRoutes)
App.use('/website', websiteRoutes)



mongoose.connect(`${process.env.MONGO_URL}`)
.then(async ()=>{

    let checkAdmin=await adminLoginModel.find()

    if(checkAdmin.length==0){
      await adminLoginModel.insertOne({
        uname:process.env.ADMINUNAME,
        pass:process.env.ADMINPASS
      })
    }

    console.log("Connected to MongoDB");
   App.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})
})
// App.listen(process.env.PORT , ()=>{
//     console.log(`Server is running on port ${process.env.PORT}`);
// })