const axios = require("axios").default;

require("dotenv").config();

const { ADMIN_ACCESS_TOKEN, SHOP_URL, API_VERSION } = process.env;

const adminURL = `${SHOP_URL}/admin/api/${API_VERSION}/graphql.json`;

const adminRequest = axios.create({
  baseURL: adminURL,
  headers: {
    "Content-Type": "application/graphql",
    "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
  },
});

const storeFrontURL = `${SHOP_URL}/api/${API_VERSION}/graphql.json`;

const storeFrontRequest = axios.create({
  baseURL: storeFrontURL,
  headers: {
    "Content-Type": "application/graphql",
  },
});

const adminRestURL = `${SHOP_URL}/admin/api/${API_VERSION}`;

const restAdmin = axios.create({
  baseURL: adminRestURL,
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
  },
});

module.exports = {
  adminRequest,
  storeFrontRequest,
  restAdmin,
};
