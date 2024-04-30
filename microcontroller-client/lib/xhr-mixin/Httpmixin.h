#include <string>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include "Arrayutils.h"

using namespace std;

class HttpMixin
{

public:
  static void get(string url, void (*callback)(String));
  static void post(string url, void (*callback)(String), JsonDocument body);
};

