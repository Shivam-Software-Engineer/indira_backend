
// ==============================
// Get All Categories
// ==============================

const Product = require("../../Model/Website_Model/Product");

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    return res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// ==============================
// Get Sub Categories
// ==============================

const getSubCategories = async (req, res) => {
  try {
    const { category } = req.params;

    const subCategories = await Product.distinct("subCategory", {
      category,
    });

    return res.status(200).json({
      status: true,
      message: "Sub Categories fetched successfully",
      data: subCategories,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// ==============================
// Get Products
// ==============================

const getProducts = async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subCategory = subcategory;
    }

    const products = await Product.find(filter);

    return res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      total: products.length,
      data: products,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getCategories,
  getSubCategories,
  getProducts,
};