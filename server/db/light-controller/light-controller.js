const { MongoManager } = require("../mongo-manager");
const mongoose = require("mongoose");

const schedulePoint = new mongoose.Schema({
  x: { type: Number, min: 0, max: 86400 }, //time of day in seconds
  y: { type: Number, min: 0, max: 100 }, //percentage
});
const lightControlSchema = new mongoose.Schema({
  deviceId: { type: String, unique: true },
  mode: { type: String, match: /schedule|manual/, default:"manual" },
  manual: {
    red: { type: Number, default: 0 },
    farmRed: { type: Number, default: 0 },
    blueRoyal: { type: Number, default: 0 },
    blue: { type: Number, default: 0 },
    green: { type: Number, default: 0 },
    ultraViolet: { type: Number, default: 0 },
    warmWhite: { type: Number, default: 0 },
    coldWhite: { type: Number, default: 0 },
  },
  schedule: {
    red: [schedulePoint],
    farmRed: [schedulePoint],
    blueRoyal: [schedulePoint],
    blue: [schedulePoint],
    green: [schedulePoint],
    ultraViolet: [schedulePoint],
    warmWhite: [schedulePoint],
    coldWhite: [schedulePoint],
  },
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
