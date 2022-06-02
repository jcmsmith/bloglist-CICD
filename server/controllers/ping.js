const pingRouter = require("express").Router();

pingRouter.get("/", (request, res) => {
  res.status(200).send("pong");
});

pingRouter.get("/health", (request, response) => {
  response.status(200).send("all good");
});

module.exports = pingRouter;
