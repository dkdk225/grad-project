#include <Arduino.h>
#include "Controller.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <cstring>
#include "Arrayutils.h"
#include "Mqttmanager.h"
#include <Wifimanager.h>
#include "Webserver.h"
#include <esp_task_wdt.h> 
#include "Loopmanager.h"
using namespace std;
const char* ssid = "Wubba-Lubba-Dub-Dub";
const char* password = "denis-has-w1f1";



const char *id = WiFi.macAddress().c_str();
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
MqttManager mqtt(topic, mqtt_server, mqtt_port, client_pointer);;
WifiManager wifiManager(ssid_ap, password_ap);


void setup() {
  Serial.begin(115200);
  id = WiFi.macAddress().c_str();
  
  Serial.println("print id----------------");
  Serial.println(id);
  Serial.println(*id);
  Serial.println(WiFi.macAddress());
  Serial.println("-----------------");
  esp_task_wdt_init(10, true); 
  mqtt.start();
  Controller controller(id, 1);
  wifiManager.to_STA(ssid, password);
  // wifiManager.to_AP();
  // Serial.println(WiFi.softAPIP());
  WebServer::start();
}

void loop() {
  esp_task_wdt_reset(); 
  delay(10);
  mqtt.monitor();
}







// #include <ArduinoJson.h>

// void setup() {

//   Serial.begin(115200);
//   Serial.println("---------------------");
//   Serial.println(WiFi.macAddress());
//   Serial.println("---------------------");
//   while (!Serial)
//     continue;

//   // Allocate the JSON document
//   JsonDocument doc;

//   // Add values in the document
//   doc["sensor"] = "gps";
//   doc["time"] = 1351824120;

//   // Add an array
//   JsonArray data = doc["data"].to<JsonArray>();
//   data.add(48.756080);
//   data.add(2.302038);

//   // Generate the minified JSON and send it to the Serial port
//   serializeJson(doc, Serial);


//   // Start a new line
//   Serial.println();

//   // Generate the prettified JSON and send it to the Serial port
//   serializeJsonPretty(doc, Serial);
//   // The above line prints:
//   // {
//   //   "sensor": "gps",
//   //   "time": 1351824120,
//   //   "data": [
//   //     48.756080,
//   //     2.302038
//   //   ]
//   // }
// }

// void loop() {
//   // not used in this example
// }
















