#include "Mqttmanager.h"
#include "Arrayutils.h"

void MqttManager::reconnect(){
  while (!client->connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client->connect(device_id, NULL, NULL)) {
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
void MqttManager::callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void MqttManager::subscribe(){
  client->subscribe(ArrayUtils::concat(topic, device_id));
}

void MqttManager::publish(char * payload) {
  client->publish(ArrayUtils::concat(topic, device_id), payload);
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