#include "Wifimanager.h"

void WifiManager::to_AP(){
  WiFi.disconnect(true);
  WiFi.mode(WIFI_AP);
  delay(100);
  IPAddress apIP(192, 168, 1, 1); // IP address of the ESP32 in AP mode
  IPAddress gateway(192, 168, 1, 1); // Gateway for the network
  IPAddress subnet(255, 255, 255, 0); // Subnet mask
  WiFi.softAPConfig(apIP, gateway, subnet);
  WiFi.softAP(device_ssid, password); 
}



void WifiManager::to_STA(const char* ssid, const char* password){
  WiFi.disconnect(true);
  delay(100);
  WiFi.mode(WIFI_STA);
  Serial.println(WiFi.getMode());
  Serial.print("Connecting to ");
  Serial.println(ssid);
  Serial.println(password);
  IPAddress local_IP(192, 168, 1, 184);
  IPAddress gateway(192, 168, 1, 1);
  IPAddress subnet(255, 255, 255, 0);
  IPAddress primaryDNS(8, 8, 8, 8); // Google DNS
  IPAddress secondaryDNS(8, 8, 4, 4); // Google DNS
  WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  NTPTimeManager::getClient()->begin();
  MqttManager::getInstance()->start();
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}