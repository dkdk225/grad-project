const mqtt = require("mqtt");
const { eventBus } = require("../event-bus");
const { mqttConnection } = require("../config");

let isConnected = false;
const topic = "noonewillbehereprobably";

class MqttManager {
  constructor() {
    this.client = null;
  }
  connect() {
    const { url } = mqttConnection;
    this.client = mqtt.connect(url);
    this.client.on("connect", () => {
      this.assignEvents(); //..
      console.log("connected to broker ?");
    });
  }
  assignEvents() {
    const update = (dict) => {
      const { deviceId } = dict;
      this.client.publish(`${topic}/devices/${deviceId}`, JSON.stringify(dict));
    };
    eventBus.on("web-client/create", update);
    eventBus.on("web-client/update", update);
    eventBus.on("web-client/watch", (deviceId) => {
      this.client.subscribe(`${topic}/devices/${deviceId}`, (err, granted) => {
        console.log(granted);
      });
    });
    eventBus.on("web-client/unwatch", (deviceId) => {
      this.client.unsubscribe(`${topic}/devices/${deviceId}`, (err, granted) => {
        console.log(granted);
      });
    });
    this.client.on("message", (topic, message) => {
      console.log("from topic: "+topic+" "+message.toString());
    });
  }
}

module.exports = new MqttManager();
