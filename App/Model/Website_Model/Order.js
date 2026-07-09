const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    products: [
      {
        _id: String,
        title: String,
        image: String,
        category: String,
        subcategory: String,

        price: Number,

        quantity: Number,

        discountPercentage: Number,

        additionalDiscount: {
          type: Number,
          default: 0,
        },
      },
    ],

    total: Number,

    totalProducts: Number,

    totalQuantity: Number,

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    orderStatus: {
      type: String,
      default: "Placed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);