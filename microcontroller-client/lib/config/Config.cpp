#include "Config.h"

string Config::SSID_AP_prefix = "controller";
string Config::server_DNS = "http://192.168.56.1:3000";
string Config::SSID_AP = Config::SSID_AP_prefix+"_"+string(WiFi.macAddress().c_str());
int Config::ESP_NOW_channel = 1;

void Config::updateSSID_AP_prefix(string newSSID_AP_prefix){
  Config::SSID_AP_prefix = newSSID_AP_prefix;
}

void Config::updateESP_NOW_channel(int newChannel){
  Config::SSID_AP_prefix = newChannel;
}