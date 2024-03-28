const { Router } = require("express");
const { eventBus } = require("../../event-bus");
const { user } = require("../../db/user");
const bcrypt = require("bcrypt");
const {JWTController} = require("../../jwt-controller");
const userRouter = Router({
  caseSensitive: true,
});

//use update to create objects
userRouter.post("/api/user/login", (req, res) => {
  const { userId, password } = req.body;
  user.readFirst({ userId }).then((result) => {
    if (result || bcrypt.compareSync(password, result.password)) {
      //create a session for user
      const credentials = {
        userId, password:result.password
      }
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
  if (user.exists({ userId })) {
    res.status(400);
    res.send("user already exists");
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const userDict = {
      userId,
      password: hash,
      userName,
    };
    user.create(userDict);
    res.sendStatus(200);
  }
});

module.exports = userRouter;
