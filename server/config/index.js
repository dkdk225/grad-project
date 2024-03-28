const corsOrigins = require("./cors-origins");
const database = require("./database");
const mqttConnection = require("./mqtt-connection");
const jwtOrigins = require("./jwt-origins");
module.exports = {
  corsOrigins,
  database,
  mqttConnection,
  jwtOrigins,
};
