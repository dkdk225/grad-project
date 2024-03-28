const { Router } = require("express");
const { lightController } = require("../../db/light-controller");
const database = Router({
  caseSensitive: true,
});

database.get("/api/database/force/:id/", async (req, res) => {
  const data = await lightController.read({ deviceId: req.params.id });
  console.log(data);
  res.status(200);
  res.send(data);
});

database.get("/api/database/listen/:id/", async (req, res) => {
  const data = await lightController.read({ deviceId: req.params.id });
  console.log(data);
  res.status(200);
  res.send(data);
});

database.post("/api/database/", async (req, res) => {
  console.log("database post call");
  res.sendStatus(200);
});

module.exports = database;
