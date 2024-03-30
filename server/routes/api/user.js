const { Router } = require("express");
const { eventBus } = require("../../event-bus");
const { user, device } = require("../../db");
const bcrypt = require("bcrypt");
const { JWTController } = require("../../jwt-controller");
const userRouter = Router({
  caseSensitive: true,
});

//use update to create objects
userRouter.post("/api/user/login", (req, res) => {
  const { userId, password } = req.body;
  user.readFirst({ userId }, "-devices").then((result) => {
    if (result || bcrypt.compareSync(password, result.password)) {
      //create a session for user
      const credentials = {
        userId,
        password: result.password,
      };
      const jwt = JWTController.generateJWT(credentials);
      res.send(jwt);
    } else {
      res.status(400);
      res.send("user doesn't exist");
    }
  });
});

userRouter.post("/api/user/create", (req, res) => {
  const { userId, password, userName } = req.body;
  user.exists({ userId }).then((result) => {
    if (result) {
      res.status(400);
      res.send("user already exists");
    } else {
      const hash = bcrypt.hashSync(password, 10);
      const userDict = {
        userId,
        password: hash,
        userName,
      };
      user.create(userDict);
      res.sendStatus(200);
    }
  });
});

userRouter.post("/api/user/devices/create", (req, res) => {
  const userId = req.jwtSender.userId;
  const { deviceId, password } = req.body;
  res.status(403)
  user.exists({ userId, "devices.deviceId": deviceId }).then((result) => {
    if (!result) {
      device.readFirst({ deviceId }).then((deviceDocument) => {
        if (!deviceDocument) {
          res.send("no such device exists")
          return
        }
          const salt = deviceDocument.password.substring(0, 29);
          const device = {
            deviceId,
            password: bcrypt.hashSync(password, salt),
          };
          user
            .update({ userId }, { $push: { devices: device } })
            .then((document) => {
              res.sendStatus(200);
            });
        
      });
    } else {
      res.send("device already exists");
    }
  });
});

userRouter.post("/api/user/devices/remove", (req, res) => {
  const userId = req.jwtSender.userId;
  const { deviceId } = req.body;
  const device = {
    deviceId,
  };
  user.exists({ userId, "devices.deviceId": deviceId }).then((result) => {
    console.log(result);
    if (result) {
      user
        .update({ userId }, { $pull: { devices: device } })
        .then((document) => {
          res.sendStatus(200);
        });
    } else {
      res.status(403);
      res.send("device doesn't exist");
    }
  });
});

userRouter.post("/api/user/devices/update", (req, res) => {
  const userId = req.jwtSender.userId;
  const { deviceId, newDeviceId } = req.body;
  const password = bcrypt.hashSync(req.body.password, 10);
  user.exists({ userId, "devices.deviceId": deviceId }).then((result) => {
    if (result) {
      user
        .update(
          { "devices.deviceId": deviceId },
          {
            $set: {
              "devices.$.deviceId": newDeviceId,
              "devices.$.password": password,
            },
          }
        )
        .then((document) => {
          res.sendStatus(200);
        });
    } else {
      res.status(403);
      res.send("device doesn't exist");
    }
  });
});
module.exports = userRouter;
