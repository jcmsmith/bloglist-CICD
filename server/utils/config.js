const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const PORT = 3003;

const NODE_ENV = process.env.NODE_ENV;

const MONGODB_URI =
  NODE_ENV === "test"
    ? process.env.REACT_APP_TEST_MONGODB_URI
    : process.env.REACT_APP_MONGODB_URI;

const SECRET = process.env.REACT_APP_SECRET;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  NODE_ENV,
};
