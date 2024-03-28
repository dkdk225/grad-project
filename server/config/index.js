const corsOrigins = require('./cors_origins')
const database = require('./database')
const mqttConnection = require('./mqtt-connection')
module.exports = {
  corsOrigins,
  database,
  mqttConnection
}