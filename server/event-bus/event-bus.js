const { EventEmitter } = require("ws");

const eventBus = new EventEmitter();
module.exports = eventBus;
// events:
//   web-client/watch
//   web-client/create
//   web-client/update