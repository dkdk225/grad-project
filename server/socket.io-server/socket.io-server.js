const { createServer } = require("http");
const { Server } = require("socket.io");
const { corsOrigins } = require("../config");
const { lightController } = require("../light-controller");

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
      lightController.create({ deviceId, ...dict });
    });
    socket.on("update", (deviceId, dict) => {
      console.log("update request");
      lightController.update(deviceId, {...dict });
    });
    socket.on("watch", (deviceId) => {
      lightController.on('update ' + deviceId, (update)=>{
        socket.emit('update', update)
      })
    });
  });

  return httpServer;
}

module.exports = startSocketIOServer;
