const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
