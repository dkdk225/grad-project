const { MongoManager } = require("../mongo-manager");
const mongoose = require("mongoose");

const device = new mongoose.Schema({
  deviceId: { type: String },
  name: { type: String },
  password: { type: String },
});

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  devices: {
    type: [device],
    default: [],
  },
});
/**
 * @type {MongoManager}
 * This is an interface for managing the light via database
 */

const user = new MongoManager({
  modelName: "User",
  schema: userSchema,
  onError: {
    create: (error, recall) => {
      console.log(error)
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

user.on("update", (update) => {
  console.log("object updated " + update.userId);
});

module.exports = user;
