#include <string>
#include <PubSubClient.h>
#include <WiFi.h>

#include <ArduinoJson.h>
#include <iostream>
using namespace std;


class MqttManager {
  const char* mqtt_server;
  const int mqtt_port;
  PubSubClient* client;
  const char* device_id;
  char *topic;

public:
  MqttManager(char* topic, const char* mqtt_server, const int mqtt_port, PubSubClient* client):mqtt_port(mqtt_port), mqtt_server(mqtt_server){
    this->client = client;
    this->topic = topic;
  };
  void reconnect();
  void subscribe();
  void publish(char* payload);
  void monitor();
  void start();
  static string getPayload(byte *data, unsigned int len);
  PubSubClient getClient();
  static void callback(char* topic, byte* payload, unsigned int length);
};

