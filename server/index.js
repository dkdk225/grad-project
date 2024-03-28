const express = require("express");
const { startSocketIOServer } = require("./socket.io-server");
const { api } = require("./routes");
const mqttManager = require("./mqtt-manager");

const cors = require("cors");
const { corsOrigins } = require("./config");
const app = express();
const { lightController } = require("./light-controller");

app.use(cors(corsOrigins));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(api.device);



mqttManager.connect()


const httpServer = startSocketIOServer(app);
httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
