const express = require("express");
const { getCategories, getSubCategories, getProducts } = require("../../Controller/Website/productController");

const ProductRoutes = express.Router();


ProductRoutes.get("/categories", getCategories);

ProductRoutes.get("/subcategory/:category", getSubCategories);

ProductRoutes.get("/", getProducts);

module.exports = { ProductRoutes };