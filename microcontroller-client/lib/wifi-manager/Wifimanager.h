#include <WiFi.h>
#include <Ntptimemanager.h>
#include <Mqttmanager.h>


class WifiManager {
  const char *device_ssid;
  const char *password;

public:
  WifiManager(const char* device_ssid, const char* password):device_ssid(device_ssid), password(password)
  {

  }
  void to_AP();
  static void to_STA(const char* ssid, const char* password);
};