const { createServer } = require("http");
const { Server } = require("socket.io");
const { corsOrigins } = require("../config");
const { lightController } = require("../db/light-controller");
const {eventBus} = require("../event-bus");

/**
 * Creates an socketIO server
 * @param app an express app
 */
function startSocketIOServer(app) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: /./,
    },
  });

  io.on("connection", (socket) => {
    console.log("a device has connected to socket");
    socket.on("create", (deviceId, dict) => {
      console.log("create request");
      eventBus.emit("web-client/create", { deviceId, ...dict });
      lightController.create({ deviceId, ...dict }).then((document)=>{
        console.log(document)
      });
    });
    socket.on("update", (deviceId, dict) => {
      eventBus.emit("web-client/update", { deviceId, ...dict });
      lightController.update(deviceId, { ...dict});
    });
    socket.on("watch", (deviceId) => {
      //change the watch to listen to mqtt and update when mqtt updates
      eventBus.emit("web-client/watch", deviceId);
      lightController.on("update " + deviceId, (update) => {
        socket.emit("update", update);
      });
    });
  });

  return httpServer;
}

module.exports = startSocketIOServer;
