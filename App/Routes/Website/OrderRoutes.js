const express = require("express");
const { placeOrder } = require("../../Controller/Website/orderController");


const OrderRoutes = express.Router();

OrderRoutes.post("/buy", placeOrder);

module.exports = {
  OrderRoutes,
};