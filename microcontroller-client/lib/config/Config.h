#include <string>
#include <cstring>
#include <WiFi.h>
using namespace std;
#ifndef Config_h // Include guard starts
#define Config_h // Define the macro
class Config{

public:
  static string SSID_AP_prefix;
  static string server_DNS;
  static string SSID_AP;
  static int ESP_NOW_channel;

  static void updateSSID_AP_prefix(string newSSID_AP_prefix);
  static void updateESP_NOW_channel(int newChannel);
};
#endif // EspNowManager_h // Include guard ends