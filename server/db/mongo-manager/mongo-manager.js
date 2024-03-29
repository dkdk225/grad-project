const mongoose = require("mongoose");
const { database } = require("../../config");
const { EventEmitter } = require("node:events");
/**
 * Event emitter with following events:
 * @event update - is triggered when update() method gets called
 * @event update [deviceId] - is triggered when update() method gets called.
 * It's unique for device
 * @event read - is triggered when read() method gets called
 * @event create - is triggered when create() method gets called
 */
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
   * @param {Object} options
   * @param {mongoose.Schema} options.schema - Mongoose schama for building the model.
   * @param {string} options.modelName - The name to represent the model in database
   * @param {Object} options.onError - Callbacks for handling method failures. Takes in the error and recall arguments in order.
   * @param {errorHandler} options.onError.create - The callback to happen when create operation  is failing.
   * @param {errorHandler} options.onError.upadte - The callback to happen when update operation is failing.
   * @param {errorHandler} options.onError.read - The callback to happen when read operation is failing.
   * error indicating the issue in program and
   * recall being a function to recall the whole process
   */
  constructor(options) {
    super();
    const { modelName, schema, onError } = options;
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
      console.log("connection to database has failed, trying again...");
      this.#open();
    });
  }
  /**
   * Creates an object according to the given dictionary and saves it to the database
   * @param {Object} dict - The foundation to create the object
   * @return {Promise} - Promise object resolving the object saved to the database
   */
  create(dict) {
    return this.#model
      .create(dict)
      .then((document) => {
        this.emit("create", document);
        return document;
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
      .then(async (result) => {
        let newDocument = null;
        if (result.matchedCount > 0) {
          //if document with given id exists
          this.emit("update", { deviceId, ...dict }); // emit general update
          this.emit("update " + deviceId, { deviceId, ...dict }); // emit device specific update
        } else {
          //if no document with given id exists create a new one
          newDocument = await this.create({ deviceId, ...dict });
        }
        return { ...result, newDocument };
      })
      .catch((error) => {
        this.#onError["update"](error, () => {
          this.update(deviceId, dict);
        });
      });
  }
  /**
   * @param {string} dict - The dictionary for lookup
   * @return {Promise} - Promise object represents the database item
   */
  read(dict) {
    return this.#model
      .find(dict)
      .exec()
      .then((result) => {
        this.emit("read", result);
        return result;
      })
      .catch((error) => {
        this.#onError["read"](error, () => {
          this.read(dict);
        });
      });
  }
  /**
   * looks at the set returns the id of first object that exists for given dictionary
   * @param {Object} dict - The dictionary for lookup
   * @return {Promise} - Promise object represents the database item
   */
  async exists(dict) {
    return await this.#model.exists(dict);
  }

  /**
   * looks at the set returns the first object that exists for given dictionary
   * @param {Object} dict - The dictionary for lookup
   * @param {string} select - filter for selecting or ignoring fields: add - to front in order to ignore like -_id
   * @return {Promise} - Promise object represents the database item
   */
  async readFirst(dict, select="") {
    return await this.#model.findOne(dict).select(select);
  }
}

module.exports = MongoManager;
