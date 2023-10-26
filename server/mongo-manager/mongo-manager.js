const mongoose = require("mongoose");
const { database } = require("../config");
const { EventEmitter } = require("node:events");
class MongoManager extends EventEmitter {
  #model;
  #onError;
  /**
   * @callback errorHandler
   * @param {Error} error - The error passed by the CRUD operation
   * @param {Function} recall - The function to recall the operation
   */

  /**
   * Creates an interface for CRUD operations and opens a connection to the database specified in config module
   * @param {mongoose.Schema} schema - The employees who are responsible for the project.
   * @param {string} modelName - The name to represent the model in database
   * @param {Function} onError - The callback that handles the response. Takes in the error and recall arguments in order.
   * error indicating the issue in program and
   * recall being a function to recall the whole process
   */
    super();
    this.#model = mongoose.model(modelName, schema);
    this.#onError = onError;
    this.#open();
  }
  /**
   * Opens a connection to mongo database
   * Upon failing it'll recall itself
   */
  #open() {
    mongoose.connect(database.uri, database.options).catch((e) => {
      console.log("connection to database has failed");
      this.#open();
    });
  }
  /**
   * Creates an object according to the given dictionary and saves it to the database
   * @param {Object} dict - The foundation to create the object
   * @return {Promise} - Promise object resolving the object saved to the database
   */
  create(dict) {
    return this.#model.create(dict)
    .then((document)=>{
      this.emit('create', document)
      return document
    })
    .catch((error) => {
      this.#onError["create"](error, () => {
        this.create(dict);
      });
    });
  }
  /**
   * @param {string} deviceId - The id of the device for database lookup
   * @param {object} dict - The object containing new key-value pairs for update
   * @return {Promise} - Promise object resolving the database item
   */
  update(deviceId, dict) {
    return this.#model
      .updateOne({ deviceId }, dict)
      .exec()
      .then((result) => {
        this.emit("update", {deviceId, ...dict});// general update
        this.emit("update " + deviceId, { deviceId, ...dict }); // device specific update
        return result
      })
      .catch((error) => {
        this.#onError["update"](error, () => {
          this.update(deviceId, dict);
        });
      });
  }
  /**
   * @param {string} deviceId - The id of the device for database lookup
   * @return {Promise} - Promise object represents the database item
   */
  read(deviceId) {
    return this.#model
      .find({ deviceId })
      .exec()
      .then((result) => {
        this.emit("read", result);
        return result
      })
      .catch((error) => {
        this.#onError["read"](error, () => {
          this.read(deviceId);
        });
      });
  }
}

module.exports = MongoManager;
