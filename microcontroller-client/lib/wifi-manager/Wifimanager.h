#include <WiFi.h>

class WifiManager {
  const char *device_ssid;
  const char *password;

public:
  WifiManager(const char* device_ssid, const char* password):device_ssid(device_ssid), password(password)
  {

  }
  void to_AP();
  void to_STA(const char* ssid, const char* password);
};