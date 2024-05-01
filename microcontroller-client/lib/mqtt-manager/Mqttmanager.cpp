#include "Mqttmanager.h"
#include "Arrayutils.h"
#include "Controller.h"

void MqttManager::reconnect(){
  while (!client->connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffffff), HEX);
    if (client->connect(clientId.c_str(), NULL, NULL)) {
      Serial.println("connected");
      subscribe();
      Serial.println("subscribed");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client->state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

string  MqttManager::getPayload(byte*data, unsigned int len) {
  string payload;
  for (size_t i = 0; i < len; i++) {
    payload += static_cast<char>(data[i]);
  }
  return payload;
}

void MqttManager::callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  JsonDocument doc;
  string jsonString = getPayload(payload, length);
  std::cout << jsonString << std::endl;
  deserializeJson(doc, jsonString);
  Controller::getInstance()->update(doc);
}

void MqttManager::subscribe(){
  String full_topic = String(topic) + WiFi.macAddress();
  client->subscribe(full_topic.c_str());
}

void MqttManager::publish(char * payload) {
  String full_topic = String(topic) + WiFi.macAddress();
  client->publish(full_topic.c_str(), payload);
}

void MqttManager::monitor() {
  if (!client->connected())
  {
    reconnect();
  }
  client->loop();
}

void MqttManager::start() {
  client->setServer(mqtt_server, mqtt_port);
  client->setCallback(MqttManager::callback);
}


PubSubClient MqttManager::getClient(){
  return *client;
};