const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

const creds = require("./google-service-account.json");

const serviceAccountAuth = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const doc = new GoogleSpreadsheet(
  process.env.GOOGLE_SHEET_ID,
  serviceAccountAuth
);

const saveOrderToSheet = async (order) => {
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];

  for (const item of order.products) {

    const totalDiscount =
      (item.discountPercentage || 0) +
      (item.additionalDiscount || 0);

    const finalPrice = Math.round(
      item.price -
        (item.price * totalDiscount) / 100
    );

    await sheet.addRow({
      Email: order.email,
      Product: item.title,
      Category: item.category,
      Quantity: item.quantity,
      Price: item.price,
      Discount: totalDiscount + "%",
      "Final Price": finalPrice,
      "Order Date": new Date().toLocaleString(),
    });
  }
};

module.exports = {
  saveOrderToSheet,
};