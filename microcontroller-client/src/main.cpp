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
#include <Looptasks.h>

using namespace std;
// const char* ssid = "Wubba-Lubba-Dub-Dub";
// const char* password = "denis-has-w1f1";

const char* ssid = "dk-redmi";
const char* password = "denizkaya01";

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
LoopTasks* loopTaskManager = LoopTasks::getInstance();

void each_loop();
void every_ten_loops();

void setup() {
  Controller::getInstance();

  Serial.begin(115200);  
  esp_task_wdt_init(10, true); 
  
  loopTaskManager->addTask("monitor_mqtt", [](){ mqtt->monitor();});
  loopTaskManager->addTask("execute_state", [](){ Controller::getInstance()->executeState();});
  loopTaskManager->addTask("reset_watchdog", [](){ esp_task_wdt_reset();});

  loopTaskManager->setExecutionList("each_loop",{"reset_watchdog"});
  loopTaskManager->setExecutionList("every_ten_loops",{"execute_state"});
  // wifiManager.to_STA(ssid, password);
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
  loopTaskManager->executeTaskList("each_loop");
}

void every_ten_loops() {
  loopTaskManager->executeTaskList("every_ten_loops");
}