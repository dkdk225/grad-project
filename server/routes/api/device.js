const { Router } = require("express");
const { lightController } = require("../../db/light-controller");
const { eventBus } = require("../../event-bus");
const device = Router({
  caseSensitive: true,
});

device.get("/api/device/:id/", async (req, res) => {
  const data = await lightController.read({ deviceId: req.params.id });
  res.status(200);
  res.send(data);
});

//use update to create objects
device.post("/api/device/update", async (req, res) => {
  const deviceId = req.body.id;
  delete req.body.id;
  lightController.update(deviceId, req.body).then((document) => {
    eventBus.emit("web-client/update", { deviceId, ...req.body });
  });
  res.sendStatus(200);
});

module.exports = device;
