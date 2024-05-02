#include <string>
#include <PubSubClient.h>
#include <WiFi.h>

#include <ArduinoJson.h>
#include <iostream>
using namespace std;

#ifndef MqttManager_h // Include guard starts
#define MqttManager_h // Define the macro
class MqttManager {
  const char* mqtt_server;
  const int mqtt_port;
  PubSubClient* client;
  const char* device_id;
  char *topic;

private:
  // Static instance pointer
  static MqttManager* instance;

  // Private constructor to prevent instantiation from outside the class
  MqttManager(char* topic, const char* mqtt_server, const int mqtt_port, PubSubClient* client):mqtt_port(mqtt_port), mqtt_server(mqtt_server){
    this->client = client;
    this->topic = topic;
  };

  // Delete copy constructor to prevent copying
  MqttManager(const MqttManager&) = delete;
  MqttManager& operator=(const MqttManager&) = delete;

public:
  static MqttManager *getInstance();
  static MqttManager *createInstance(char* topic, const char* mqtt_server, const int mqtt_port, PubSubClient* client);
  void reconnect();
  void subscribe();
  void publish(char* payload);
  void monitor();
  void start();
  static string getPayload(byte *data, unsigned int len);
  PubSubClient getClient();
  static void callback(char* topic, byte* payload, unsigned int length);
};
#endif // MqttManager_h // Include guard ends