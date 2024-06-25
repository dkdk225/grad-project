#include <WiFi.h>
#include <Ntptimemanager.h>
#include <Mqttmanager.h>
#include <Looptasks.h>
#include <Config.h>

#ifndef WifiManager_h // Include guard starts
#define WifiManager_h // Define the macro  LoopTasks_h
class WifiManager {
  const char *device_ssid;
  const char *password;

public:
  // WifiManager() : device_ssid(""), password(""){}
  WifiManager(const char* device_ssid, const char* password) : device_ssid(device_ssid), password(password){}
  static void to_AP();
  static void to_ESPNOW_AP();
  static void to_ESPNOW_STA();
  static void to_STA(const char* ssid, const char* password);
};

#endif // WifiManager_h