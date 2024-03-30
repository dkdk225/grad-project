const { JWTController } = require("../jwt-controller");

module.exports = function () {
  return (req, res, next) => {
    console.log("JWT");
    req.jwt = false;
    req.jwtSender = null;
    const auth = req.get("Authorization");
    if (auth) {
      try {
        const token = auth.substring(7);
        const sender = JWTController.validateJWT(token);
        if (sender) {
          req.jwtSender = sender
          next()
          return
        }
      } catch (error) {
        console.log("ERROR at jwt controll");
        console.log(error);
      }
    }
    res.status(403)
    res.end()
  };
};
