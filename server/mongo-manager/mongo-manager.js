const mongoose = require("mongoose");
const { database } = require("../config");

/**
 * Callback used by myFunction.
 * @callback MyClass~onSuccess
 * @param {number} resultCode
 * @param {string} resultMessage
 */

class MongoManager {
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
  constructor(modelName, schema, onError) {
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
    const document = new this.#model(dict);
    return document.save().catch((error) => {
      this.#onError(error, () => {
        this.create();
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
      .catch((error) => {
        this.#onError(error, () => {
          this.update();
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
      .catch((error) => {
        this.#onError(error, () => {
          this.read(deviceId);
        });
      });
  }
}

module.exports = MongoManager;
