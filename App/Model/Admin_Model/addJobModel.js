let mongoose = require("mongoose");

let addJobSchema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    salaryRange: {
        type: String
    },
    experienceLevel: {
        type: String
    },
    location: String,
    JobType: {
        type:String,
        default:"Full Time"
    },
    description: String,
    
    
    status: {
        type: Boolean,
        default: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    }
})


let addJobModel = mongoose.model("Jobs", addJobSchema);
module.exports={addJobModel};