const pingRouter = require("express").Router();

pingRouter.get("/", (request, response) => {
  response.status(200);
});

pingRouter.get("/health", (request, response) => {
  response.send("all good");
});

module.exports = pingRouter;
