const express = require("express");
const { startSocketIOServer } = require("./socket.io-server");
const { api } = require("./routes");
const mqttManager = require("./mqtt-manager");
const { jwtMiddleware } = require("./middleware");
const cors = require("cors");
const { corsOrigins, jwtOrigins } = require("./config");
const app = express();
const { lightController } = require("./db/light-controller");

app.use(cors(corsOrigins));
app.use(jwtOrigins, jwtMiddleware());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(api.deviceControl);
app.use(api.user);

mqttManager.connect();

const httpServer = startSocketIOServer(app);
httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
