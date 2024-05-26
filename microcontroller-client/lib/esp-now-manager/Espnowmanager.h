
#include <esp_now.h>
#include <vector>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <Config.h>
#include <iostream>

using namespace std;

#ifndef EspNowManager_h // Include guard starts
#define EspNowManager_h // Define the macro
class EspNowManager {
  vector<esp_now_peer_info_t> slaves;

public:
  EspNowManager() : slaves({}){}
  void scanForSlaves();
  void propagateState(JsonDocument state);

};

#endif // EspNowManager_h // Include guard ends
