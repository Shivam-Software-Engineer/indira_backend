
let express = require("express");
const { Authentication } = require("./Website/auth");
const { ProductRoutes } = require("./Website/productRoutes");
const { OrderRoutes } = require("./Website/OrderRoutes");

let websiteRoutes=express.Router();


websiteRoutes.use('/auth', Authentication)
websiteRoutes.use('/product', ProductRoutes)
websiteRoutes.use("/order", OrderRoutes);

module.exports={websiteRoutes};