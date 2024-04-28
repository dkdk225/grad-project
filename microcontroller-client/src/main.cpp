#include <Arduino.h>
#include "Controller.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <cstring>
#include "Arrayutils.h"
#include "Mqttmanager.h"
#include <WebServer.h>
#include <Wifimanager.h>
using namespace std;
const char* ssid = "Wubba-Lubba-Dub-Dub";
const char* password = "denis-has-w1f1";


















char id_string[] = "some-unique-id-567562";
char *id = id_string;
const char* ssid_ap = "AP mode 567562";
const char* password_ap = "admintest";



const char* mqtt_server = "mqtt-dashboard.com";
const int mqtt_port = 1883; // Default MQTT port
const char* mqtt_user = "your_MQTT_USERNAME"; // Optional
const char* mqtt_password = "your_MQTT_PASSWORD"; // Optional
char topic_string[] = "noonewillbehereprobably/devices/";
char *topic = topic_string;

WiFiClient espClient;
PubSubClient client(espClient);
PubSubClient *client_pointer = &client;
MqttManager mqtt(id, topic, mqtt_server, mqtt_port, client_pointer);
WifiManager wifiManager(ssid_ap, password_ap);
WebServer server(80);
void test();
void setup() {
  Serial.begin(115200);
  Controller controller(id, 1);
  wifiManager.to_AP();
  mqtt.start();
  Serial.println(WiFi.softAPIP());
  Serial.println(WiFi.localIP());
  server.on("/", test);
  server.begin();
}

void loop() {
  
  delay(100);
  server.handleClient();
  // mqtt.monitor();
}

void test () {
  Serial.println("A CALLL");
  server.send(200, "text/html", "hello world");
}

