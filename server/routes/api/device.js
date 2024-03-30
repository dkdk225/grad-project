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
  const deviceId = req.body.deviceId;
  const password = bcrypt.hashSync(req.body.password, 10);
  device.exists({ deviceId }).then((result) => {
    if (!result) {
      device.create({ deviceId, password }).then((document) => {
        res.sendStatus(200);
      });
    } else {
      res.status(403);
      res.send("device already exists");
    }
  });
});

module.exports = deviceRouter;
