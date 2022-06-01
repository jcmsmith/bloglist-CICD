const pingRouter = require("express").Router();

pingRouter.get("/ping", (request, response) => {
  response.status(200);
});

pingRouter.get("/healthcheck", (request, response) => {
  response.send("all good");
});

module.exports = pingRouter;
