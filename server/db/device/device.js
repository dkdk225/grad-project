const { MongoManager } = require("../mongo-manager");
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, unique: true },
  password: { type: String },
});
/**
 * @type {MongoManager}
 * This is an interface for managing the light via database
 */

const device = new MongoManager({
  modelName: "Device",
  schema: deviceSchema,
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

module.exports = device;
