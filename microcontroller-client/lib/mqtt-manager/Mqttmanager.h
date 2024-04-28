#include <string>
#include <PubSubClient.h>
#include <WiFi.h>
using namespace std;


class MqttManager {
  const char* mqtt_server;
  const int mqtt_port;
  PubSubClient* client;
  char *device_id;
  char *topic;

public:
  MqttManager(char* device_id, char* topic, const char* mqtt_server, const int mqtt_port, PubSubClient* client):mqtt_port(mqtt_port), mqtt_server(mqtt_server){
    this->client = client;
    this->device_id = device_id;
    this->topic = topic;
    Serial.println(mqtt_server);
    Serial.println(mqtt_port);


  };
  void reconnect();
  void subscribe();
  void publish(char* payload);
  void monitor();
  void start();
  PubSubClient getClient();
  static void callback(char* topic, byte* payload, unsigned int length);
};

