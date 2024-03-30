const { Router } = require("express");
const { lightController, user, device } = require("../../db");
const bcrypt = require("bcrypt");
const { eventBus } = require("../../event-bus");
const deviceControl = Router({
  caseSensitive: true,
});

//use update to create objects
deviceControl.post("/api/device-control/update", async (req, res) => {
  const deviceId = req.body.deviceId;
  delete req.body.deviceId;
  const userId = "some value2";
  // const userId = req.body.sender.userId
  user
    .aggregate([
      {
        $match: {
          userId,
          "devices.deviceId": deviceId,
        },
      },
      {
        $project: {
          devices: {
            $filter: {
              input: "$devices",
              as: "userDevice",
              cond: { $eq: ["$$userDevice.deviceId", deviceId] },
            },
          },
        },
      },
      { $limit: 1 },
    ])
    .then((result) => {
      const userDevice = result[0].devices[0];
      device.readFirst({ deviceId }).then((deviceDocument) => {
        if (deviceDocument.password === userDevice.password) {
          lightController.update({ deviceId }, req.body).then((document) => {
            eventBus.emit("web-client/update", { deviceId, ...req.body });
            res.sendStatus(200);
          });
        }
      });
    });
});
deviceControl.get("/api/device-control/:id/", async (req, res) => {
  const data = await lightController.readFirst(
    { deviceId: req.params.id },
    "-deviceId"
  );
  res.status(200);
  res.send([data]);
});

module.exports = deviceControl;
