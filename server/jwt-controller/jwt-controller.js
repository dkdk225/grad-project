const jwt = require("jsonwebtoken");
const { randomBytes } = require("node:crypto");

class JWTController {
  #tokens;
  //stores encrypted secret keys in a map as token: key pair
  constructor() {
    this.#tokens = new Map();
  }
  /**
   * 
   * @param {Object} payload user data
   * @returns 
   */
  generateJWT(payload) {
    //generate key
    const secretKey = randomBytes(32);
    //generate jwt
    const token = jwt.sign(payload, secretKey, {
      expiresIn: "1h",
    });
    this.#tokens.set(token, secretKey);
    return token;
  }

  validateJWT(token) {
    const secretKey = this.#tokens.get(token);
    if (!secretKey) throw Error("No such token");
    return jwt.verify(token, secretKey);
  }
}

module.exports = new JWTController()

