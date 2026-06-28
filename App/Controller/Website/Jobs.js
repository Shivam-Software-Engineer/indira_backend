const { transporter } = require("../../Configurations/mailConfig");
const {addJobModel} = require("../../Model/Admin_Model/addJobModel");
const {submitApplication} = require("../../Model/Website_Model/submitApplication");


let submitApp = async (req, res) => {

  try {
    let { id } = req.params;

    let obj = { ...req.body };

    if (req.file) {
      obj.resume = req.file.path;
      obj.staticPath = "cloudinary";
    }

    obj.appliedFor = id;

    // Job Details
    const job = await addJobModel.findById(id);

   

    // Save Candidate
    const application = await submitApplication.create(obj);

    // Mail
    await transporter.sendMail({
      from: `"Vistaar Digital" <${process.env.SMTP_USER}>`,
      to: application.email,
      subject: `Application Received - ${job.jobTitle}`,
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{
    margin:0;
    background:#f5f6fa;
    font-family:Arial,sans-serif;
}
.container{
    max-width:650px;
    margin:30px auto;
    background:white;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 5px 20px rgba(0,0,0,.1);
}
.header{
    background:#0F62FE;
    color:white;
    text-align:center;
    padding:35px;
}
.content{
    padding:30px;
    color:#444;
    line-height:1.8;
}
table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
}
td{
    padding:12px;
    border-bottom:1px solid #eee;
}
.footer{
    background:#f3f3f3;
    padding:20px;
    text-align:center;
    color:#777;
}
.badge{
    background:#fff3cd;
    color:#856404;
    padding:6px 12px;
    border-radius:20px;
    font-weight:bold;
}
</style>
</head>

<body>

<div class="container">

<div class="header">
<h1>Application Received </h1>
<p>Thank you for applying at Vistaar Digital</p>
</div>

<div class="content">

<h2>Hello ${application.username},</h2>

<p>
Thank you for applying at <b>Vistaar Digital</b>.
We have successfully received your application.
</p>

<p>
Our HR team will review your profile carefully.
If your profile matches our requirements, we'll contact you soon.
</p>

<table>

<tr>
<td><b>Candidate Name</b></td>
<td>${application.username}</td>
</tr>

<tr>
<td><b>Email</b></td>
<td>${application.email}</td>
</tr>

<tr>
<td><b>Applied For</b></td>
<td>${job.jobTitle}</td>
</tr>

<tr>
<td><b>Current Location</b></td>
<td>${application.currentLocation}</td>
</tr>

<tr>
<td><b>Current Company</b></td>
<td>${application.currentWork || "-"}</td>
</tr>

<tr>
<td><b>Status</b></td>
<td><span class="badge">Pending Review</span></td>
</tr>

</table>

<p style="margin-top:30px">
Thanks once again for your interest in joining our team.
We wish you the very best!
</p>

<p>
Regards,<br>
<b>HR Team</b><br>
Vistaar Digital
</p>

</div>

<div class="footer">
© ${new Date().getFullYear()} Vistaar Digital<br>
This is an automated email. Please do not reply.
</div>

</div>

</body>
</html>
`
    });

     res.send({
      status: 1,
      message: "Job applied successfully",
      data: application
    });

  } 
  
  catch (error) {
     res.send({
      status: 0,
      message: error.message
    });
  }
};

let viewJobs = async (req, res)=>{
    try{
        let viewJobs = await addJobModel.find({status:true});
        obj = {
            status: 1,
            message: "Jobs fetched successfully",   
            data: viewJobs
        }
        res.send(obj);
    }
    catch(error){
        obj = {
            status: 0,
            message: error.message
        }
        res.send(obj);
    }
}




let singleJob =async  (req, res) => {
    let {id}=req.params
    try{
        let viewSingleJob = await addJobModel.findOne({_id:id});
        obj = {
            status: 1,
            message: "Job fetched successfully",   
            data: viewSingleJob
        }
        res.send(obj);
    }
    catch(error){
        obj = {
            status: 0,
            message: error.message
        }
        res.send(obj);
    }

}


let updateCandidateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {

    const application = await submitApplication
      .findById(id)
      .populate("appliedFor");

    if (!application) {
      return res.send({
        status: 0,
        message: "Candidate not found"
      });
    }

    application.status = status;
    await application.save();

    let subject = "";
    let heading = "";
    let message = "";
    let color = "";

    switch (status) {

      case "Shortlisted":
        subject = `Congratulations! You have been Shortlisted`;
        heading = "Congratulations!";
        color = "#2563eb";

        message = `
        We are pleased to inform you that your application has been
        <strong>shortlisted</strong> for the next stage of our recruitment process.

        <br><br>

        Our HR team will contact you shortly with interview details and the
        next steps.
        `;
        break;

      case "Selected":
        subject = `Congratulations! You're Selected`;
        heading = "You're Selected!";
        color = "#16a34a";

        message = `
        Congratulations!

        <br><br>

        We are delighted to inform you that you have been
        <strong>selected</strong> for the position.

        <br><br>

        Our HR team will contact you soon regarding your joining process,
        required documents and onboarding.
        `;
        break;

      case "Rejected":
        subject = `Application Status Update`;
        heading = "Application Update";
        color = "#dc2626";

        message = `
        Thank you for your interest in joining Vistaar Digital.

        <br><br>

        After carefully reviewing your profile,
        we have decided to move forward with another candidate
        for this position.

        <br><br>

        We sincerely appreciate the time and effort you invested
        in the application process and encourage you to apply
        again for future opportunities.
        `;
        break;

      default:
        subject = "Application Status Updated";
        heading = "Application Updated";
        color = "#0F62FE";

        message = `
        Your application status has been updated successfully.
        `;
    }

    await transporter.sendMail({

      from: `"Vistaar Digital HR" <${process.env.SMTP_USER}>`,
      to: application.email,
      subject,

      html: `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

body{

margin:0;
padding:0;
background:#eef2f7;
font-family:Arial,Helvetica,sans-serif;

}

.wrapper{

width:100%;
padding:30px 0;

}

.container{

max-width:700px;
margin:auto;
background:#ffffff;
border-radius:15px;
overflow:hidden;
box-shadow:0 8px 30px rgba(0,0,0,.08);

}

.header{

background:${color};
padding:40px;
text-align:center;
color:white;

}

.logo{

font-size:32px;
font-weight:bold;

}

.content{

padding:40px;

color:#444;
line-height:1.8;

}

.info{

margin:30px 0;
background:#f8fafc;
border-left:6px solid ${color};
border-radius:10px;
padding:20px;

}

table{

width:100%;
border-collapse:collapse;

}

td{

padding:12px;
border-bottom:1px solid #ececec;

}

.status{

display:inline-block;
padding:8px 18px;
border-radius:30px;
background:${color};
color:white;
font-weight:bold;

}

.footer{

background:#f5f5f5;
padding:25px;
text-align:center;
font-size:13px;
color:#777;

}

.social{

margin-top:15px;

}

.social a{

text-decoration:none;
margin:0 8px;

}

</style>

</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">

<div class="logo">
Vistaar Digital
</div>

<h1>${heading}</h1>

</div>

<div class="content">

<h2>Hello ${application.username},</h2>

<p>

${message}

</p>

<div class="info">

<h3 style="margin-top:0;">Application Details</h3>

<table>

<tr>

<td><strong>Candidate</strong></td>

<td>${application.username}</td>

</tr>

<tr>

<td><strong>Email</strong></td>

<td>${application.email}</td>

</tr>

<tr>

<td><strong>Applied Position</strong></td>

<td>${application.appliedFor?.jobTitle || "-"}</td>

</tr>

<tr>

<td><strong>Current Status</strong></td>

<td>

<span class="status">

${status}

</span>

</td>

</tr>

<tr>

<td><strong>Updated On</strong></td>

<td>${new Date().toLocaleDateString()}</td>

</tr>

</table>

</div>

<p>

Thank you once again for choosing
<strong>Vistaar Digital</strong>.

</p>

<p>

If you have any questions,
feel free to contact our HR team.

</p>

<br>

<p>

Warm Regards,

<br><br>

<strong>HR Team</strong>

<br>

Vistaar Digital

</p>

</div>

<div class="footer">

<strong>Vistaar Digital</strong>

<br><br>

This is an automated email.
Please do not reply directly to this email.

<br><br>

© ${new Date().getFullYear()} Vistaar Digital.
All Rights Reserved.

</div>

</div>

</div>

</body>

</html>
`
    });

    return res.send({
      status: 1,
      message: "Candidate status updated successfully."
    });

  } catch (error) {

    return res.send({
      status: 0,
      message: error.message
    });

  }
};



module.exports={submitApp, singleJob, viewJobs, updateCandidateStatus };