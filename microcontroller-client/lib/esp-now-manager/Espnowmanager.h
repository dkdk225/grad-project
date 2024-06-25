
#include <esp_now.h>
#include <vector>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <Config.h>
#include <iostream>
#include <esp_now.h>
#include <esp_wifi.h>
#include <Wifimanager.h>
#include "Controller.h"
using namespace std;

#ifndef EspNowManager_h // Include guard starts
#define EspNowManager_h // Define the macro
class EspNowManager {
  vector<esp_now_peer_info_t*> slaves;

private:
  // Static instance pointer
  static EspNowManager *instance;

  // Private constructor to prevent instantiation from outside the class
  EspNowManager()
  {
    this->slaves = {};
  }
    // Delete copy constructor to prevent copying
    EspNowManager(const EspNowManager&) = delete;
    EspNowManager& operator=(const EspNowManager&) = delete;


public:
  static EspNowManager* getInstance();
  void scanForSlaves();
  void propagateState(JsonDocument state);
  void openMaster();
  void close();
  void openSlave();
  void deleteSlaves();
};

#endif // EspNowManager_h // Include guard ends
