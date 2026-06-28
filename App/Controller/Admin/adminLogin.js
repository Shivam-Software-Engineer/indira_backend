const { adminLoginModel } = require("../../Model/Admin_Model/adminLogin");



let adminLogin = async (req, res)=>{
    let {uname,pass}=req.body
    // console.log(req.body)
    let checkAdmin=await adminLoginModel.findOne({uname,pass})
    let obj
    
    try {
    if (!checkAdmin) {
        throw new Error("Invalid username or Password!");
    }

    res.send({
        status: 1,
        message: "Logged in!",
        id: checkAdmin._id
    });

} catch (err) {
    res.send({
        status: 0,
        message: err.message
    });
}
}

let adminCookeieCheck = async (req, res)=>{
    let {id}=req.params
    
    let checkId=await adminLoginModel.findOne()
    let obj
    if(checkId){
        obj={
            status:1,
            message:"Loginned!",
            checkId
        }
        res.send(obj)
    }
    else{
        obj={
            status:0,
            message:"Invalid id"
        }
        res.send(obj)
    }
}



module.exports={adminLogin, adminCookeieCheck};