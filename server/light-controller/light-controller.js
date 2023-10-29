const { MongoManager } = require("../mongo-manager");
const mongoose = require("mongoose");

const lightControlSchema = new mongoose.Schema({
  deviceId: { type: String, unique: true },
  red: { type: Number, default: 0 },
  farmRed: { type: Number, default: 0 },
  blueRoyal: { type: Number, default: 0 },
  blue: { type: Number, default: 0 },
  green: { type: Number, default: 0 },
  ultraViolet: { type: Number, default: 0 },
  warmWhite: { type: Number, default: 0 },
  coldWhite: { type: Number, default: 0 },
});
/**
 * @type {MongoManager}
 * This is an interface for managing the light via database
 */

const lightController = new MongoManager({
  modelName: "LightControl",
  schema: lightControlSchema,
  onError: {
    create: (error, recall) => {
      //11000 is the error code for duplication
      if (error.code !== 11000) {
        recall();
      }
    },
    update: (error, recall) => {
      console.log(error);
      console.log("update has failed");
    },
    read: (error, recall) => {
      console.log("read has failed");
    },
  },
});

lightController.on("update", (update) => {
  console.log("object updated " + update.deviceId);
});

module.exports = lightController;
