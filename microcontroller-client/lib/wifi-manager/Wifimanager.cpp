#include "Wifimanager.h"
#include <WiFi.h>

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
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}