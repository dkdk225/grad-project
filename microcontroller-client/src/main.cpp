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
#include <Ntptimemanager.h>


using namespace std;
const char* ssid = "Wubba-Lubba-Dub-Dub";
const char* password = "denis-has-w1f1";



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
MqttManager* mqtt = MqttManager::createInstance(topic, mqtt_server, mqtt_port, client_pointer);
WifiManager wifiManager(ssid_ap, password_ap);


void each_loop();
void every_ten_loops();

void setup() {
  Serial.begin(115200);  
  // wifiManager.to_STA(ssid, password);
  esp_task_wdt_init(10, true); 
  // mqtt.start();
  Controller::getInstance();
  
  wifiManager.to_AP();
  Serial.println(WiFi.softAPIP());
  WebServer::start();
}


int counter = 0;
void loop() {
  if(counter >= 99){
    counter = 0;
  }
  each_loop();
  if(counter == 0){
    every_ten_loops();
  }

  delay(100);
  counter++;
}

void each_loop(){
  esp_task_wdt_reset(); 
  mqtt->monitor();
  Controller::getInstance()->executeState();
}

void every_ten_loops() {
  // Controller::getInstance()->executeSchedule();
}

// int led = 13;
// void setup() {
//   // Set pin mode

//   pinMode(led, OUTPUT);
//   digitalWrite(led,HIGH);

  
// }

// void loop() {

//   digitalWrite(led,HIGH);
//   delay(100);
//   digitalWrite(led,LOW);
//   delay(100);
// }

