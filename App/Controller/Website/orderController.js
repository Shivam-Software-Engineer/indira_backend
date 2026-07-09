const { saveOrderToSheet } = require("../../Configurations/googleSheet");
const Order = require("../../Model/Website_Model/Order");

const placeOrder = async (req, res) => {
  try {
    const {
      email,
      products,
      total,
      totalProducts,
      totalQuantity,
    } = req.body;

    if (!email) {
      return res.json({
        status: 0,
        message: "Email Required",
      });
    }

    if (!products || products.length === 0) {
      return res.json({
        status: 0,
        message: "Cart Empty",
      });
    }

    // MongoDB Save
    const order = await Order.create({
      email,
      products,
      total,
      totalProducts,
      totalQuantity,
    });

    // Google Sheet Save
    try {
      await saveOrderToSheet(order);
      console.log("Google Sheet Saved");
    } catch (sheetError) {
      console.log("Google Sheet Error");
      console.log(sheetError);
    }

    res.json({
      status: 1,
      message: "Order Placed Successfully",
      data: order,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: 0,
      message: "Server Error",
    });
  }
};

module.exports = {
  placeOrder,
};