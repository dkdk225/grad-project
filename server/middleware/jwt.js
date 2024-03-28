const { JWTController } = require("../jwt-controller");

module.exports = function () {
  return (req, res, next) => {
    console.log("JWT");
    req.jwt = false;
    req.jwtSender = null;

    const auth = req.get("Authorization");
    console.log(auth)
    if (auth) {
      try {
        const token = auth.substring(7);
        const sender = JWTController.validateJWT(token);
        console.log(sender)
        if (sender) {
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
