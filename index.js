require("dotenv").config();

let express = require("express");
let mongoose = require("mongoose");
let App = express();
let cors = require("cors");
const { websiteRoutes } = require("./App/Routes/WebsiteRoutes");

App.use(cors());
App.use(express.json());




App.use('/website', websiteRoutes)



mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    App.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
