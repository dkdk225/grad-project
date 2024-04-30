const { Router } = require("express");
const { device, user } = require("../../db");
const bcrypt = require("bcrypt");

const deviceRouter = Router({
  caseSensitive: true,
});

deviceRouter.post("/api/device/update", (req, res) => {
  const deviceId = req.body.deviceId;
  const password = bcrypt.hashSync(req.body.password, 10);
  device.exists({ deviceId }).then((result) => {
    if (result) {
      device.update({ deviceId }, { password }).then((document) => {
        res.sendStatus(200);
      });
    } else {
      res.status(403);
      res.send("device doesn't exist");
    }
  });
});

deviceRouter.post("/api/device/create", async (req, res) => {
  console.log("create device req");
  const deviceId = req.body.deviceId;
  const password = bcrypt.hashSync(req.body.password, 10);
  device.exists({ deviceId }).then((result) => {
    if (!result) {
      //creates a new device
      device.create({ deviceId, password }).then((document) => {
        res.sendStatus(200);
      });
    } else {
      //if device already exists updates the device
      device.update({ deviceId }, { password }).then((document) => {
        res.sendStatus(200);
      });
    }
  });
});

module.exports = deviceRouter;
