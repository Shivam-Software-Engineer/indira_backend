const bcrypt = require("bcrypt");
const { User } = require("../../Model/Website_Model/userModel");
const { transporter } = require("../../Configurations/mailConfig");

let useOtp = new Map();

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and Password are required",
      });
    }

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(400).json({
        status: false,
        message: "Email already registered",
      });
    }

    
    let OTP = Number(
      (Math.random() * 999999).toString().split(".")[0].slice(0, 4)
    );

    useOtp.set(email, {
      otp: OTP,
      password,
    });
    console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "FOUND" : "MISSING");

    await transporter.sendMail({
      from: `"Indira IVF" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Indira IVF - Email Verification",
      html: `
        <div style="max-width:600px;margin:auto;background:#f8f9fa;padding:30px;font-family:Arial">

          <div style="background:white;padding:40px;border-radius:10px;text-align:center">

            <h1 style="color:#0d6efd;">Indira IVF</h1>

            <h2>Email Verification</h2>

            <p>Thank you for registering.</p>

            <p>Your Verification OTP is</p>

            <h1
              style="
              background:#0d6efd;
              color:white;
              display:inline-block;
              padding:15px 40px;
              border-radius:8px;
              letter-spacing:8px;
            ">
              ${OTP}
            </h1>

            <p style="margin-top:20px;">
              Please do not share this OTP with anyone.
            </p>

          </div>

        </div>
      `,
    });

    return res.json({
      status: true,
      message: "OTP Sent Successfully",
      OTP
    });
  } catch (err) {
    console.log(err);
     console.log("========= MAIL ERROR =========");
  console.log(mailError);
  console.log("Message :", mailError.message);
  console.log("Code :", mailError.code);
  console.log("Response :", mailError.response);
  console.log("==============================");

    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

const otp = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // Email dobara check
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(400).json({
        status: false,
        message: "Email already registered",
      });
    }

    const data = useOtp.get(email);

    if (!data) {
      return res.status(400).json({
        status: false,
        message: "OTP expired",
      });
    }

    if (Number(otp) !== data.otp) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashPassword,
    });

    useOtp.delete(email);

    return res.json({
      status: true,
      message: "Registration Successful",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};



let login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({
        status: 0,
        message: "Email and Password are required",
      });
    }

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.send({
        status: 0,
        message: "Email not registered",
      });
    }

    const checkPassword = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!checkPassword) {
      return res.send({
        status: 0,
        message: "Invalid Password",
      });
    }

    res.send({
      status: 1,
      message: "Login Successfully",
      data: {
        _id: checkUser._id,
        email: checkUser.email,
      },
    });
  } catch (error) {
    res.send({
      status: 0,
      message: error.message,
    });
  }
};




module.exports={register,login,otp };