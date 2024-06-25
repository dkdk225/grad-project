#include "Config.h"

string Config::SSID_AP_prefix = "controller";
string Config::server_DNS = "http://192.168.56.1:3000";
string Config::SSID_AP = Config::SSID_AP_prefix+"_"+string(WiFi.macAddress().c_str());
string Config::AP_password = "admintest";
int Config::ESP_NOW_channel = 13;
int Config::ESP_NOW_mode = 0; //0: closed | 1: master | 2: slave

void Config::updateSSID_AP_prefix(string newSSID_AP_prefix){
  Config::SSID_AP_prefix = newSSID_AP_prefix;
}

void Config::updateESP_NOW_channel(int newChannel){
  Config::ESP_NOW_channel = newChannel;
}

void Config::updateESP_NOW_mode(int newMode){
  Config::ESP_NOW_mode = newMode;
}
